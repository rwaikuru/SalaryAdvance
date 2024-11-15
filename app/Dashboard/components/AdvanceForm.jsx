import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import supabase from "../../../lib/supabaseClient";



// Define form schema with validation using Zod
const FormSchema = z.object({
  advanceAmount: z.number({ invalid_type_error: "Enter a valid amount" }).min(1, { message: "Request Advance Amount is required." }),
  repaymentPeriod: z.string().min(1, { message: "Repayment Period is required." }),
  paymentMethod: z.string().min(1, { message: "Payment Method is required." }),
  reasonForAdvance: z.string().optional(),
  phoneNumber: z.string().optional(),
  otp: z.string().optional(),
});

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [eligibleAmount, setEligibleAmount] = useState(0);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");


  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      advanceAmount: "",
      repaymentPeriod: "",
      paymentMethod: "",
      reasonForAdvance: "",
      phoneNumber: "",
      otp: "",
    },
  });

  useEffect(() => {
    const fetchSalaryAndDetails = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError("User not logged in. Please log in first.");
        return;
      }

      const email = session.user.email;
      const { data: employeeData, error: fetchError } = await supabase
        .from("employees")
        .select("id, name, salary")
        .eq("email", email)
        .single();

      if (fetchError || !employeeData) {
        setError("Unable to fetch employee information.");
        return;
      }

      const eligible = (2 / 3) * employeeData.salary;
      setEligibleAmount(eligible);
      setEmployeeDetails(employeeData);
    };

    fetchSalaryAndDetails();
  }, []);

  const handleNextStep = () => {
    if (step === 2) {
      setSubmittedData({
        ...form.getValues(),
        employeeCode: employeeDetails?.id,
        employeeName: employeeDetails?.name,
        salary: eligibleAmount,
      });
    }
    setStep(step + 1);
  };

  return (
    <Card className="w-2/3  mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Request Advance</CardTitle>
        <CardDescription>Follow the steps to complete your request.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`h-6 w-6 flex items-center justify-center rounded-full text-white ${step >= s ? "bg-teal-500" : "bg-gray-300"}`}>
                {step > s ? "✓" : s}
              </div>
              <span className="text-sm font-semibold mt-1">
                {`Step ${s}`}
              </span>
              <span className="text-xs text-gray-500">
                {s === 1 ? "Fill in Details" : s === 2 ? "Phone Verification" : "Review & Submit"}
              </span>
              {s < 3 && <div className={`h-1 w-20 ${step >= s + 1 ? "bg-teal-500" : "bg-gray-300"}`} />}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-6">
            {step === 1 && (
              <>
                {/* Advance Amount Field */}
                <FormField
                  name="advanceAmount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Amount"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Repayment Period Field */}
                <FormField
                  name="repaymentPeriod"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repayment Period</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Repayment Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-off">One-off</SelectItem>
                            <SelectItem value="2 months">2 Months</SelectItem>
                            <SelectItem value="3 months">3 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method Field */}
                <FormField
                  name="paymentMethod"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <div className="flex space-x-4">
                        <div onClick={() => field.onChange("bank")} className={`cursor-pointer p-4 border rounded-lg flex items-center justify-between w-1/2 ${field.value === "bank" ? "border-purple-500" : "border-gray-300"}`}>
                          <input type="radio" value="bank" checked={field.value === "bank"} onChange={() => field.onChange("bank")} className="mr-2" />
                          <span>Bank</span>
                        </div>
                        <div onClick={() => field.onChange("mpesa")} className={`cursor-pointer p-4 border rounded-lg flex items-center justify-between w-1/2 ${field.value === "mpesa" ? "border-purple-500" : "border-gray-300"}`}>
                          <input type="radio" value="mpesa" checked={field.value === "mpesa"} onChange={() => field.onChange("mpesa")} className="mr-2" />
                          <span>M-Pesa</span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reason for Advance Field */}
                <FormField
                  name="reasonForAdvance"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Advance</FormLabel>
                      <FormControl>
                        <Input placeholder="Reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}


{step === 2 && (
  <>
    {/* Email verification with password input */}
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold">Hi, {employeeDetails?.name}</h3>
      <p>{employeeDetails?.email}</p>
      <p className="text-gray-600">To continue, first verify it’s you</p>

      {/* Password Input */}
      <FormItem>
        <FormLabel className="text-lg">Enter your password</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      {/* Add More Options Link and Next Button */}
      <div className="flex justify-between w-full mt-4">
        <button type="button" className="text-blue-500">More options</button>
        <Button onClick={() => handleNextStep()}>Next</Button>
      </div>
    </div>
  </>
)}
     

            {step === 3 && submittedData && (
              <>
                <h3 className="font-semibold text-lg">Review Your Submission</h3>
                <p><strong>Employee Name:</strong> {submittedData.employeeName}</p>
                <p><strong>Advance Amount:</strong> KES {submittedData.advanceAmount}</p>
                <p><strong>Repayment Period:</strong> {submittedData.repaymentPeriod}</p>
                <p><strong>Payment Method:</strong> {submittedData.paymentMethod}</p>
                <p><strong>Reason for Advance:</strong> {submittedData.reasonForAdvance}</p>
                <p><strong>Phone Number:</strong> +254 {submittedData.phoneNumber}</p>
              </>
            )}

            {/* Next/Submit Button */}
            <Button type="submit" className="w-full">
              {step < 3 ? "Next" : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from "react";
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

// Define form schema with validation using Zod
const FormSchema = z.object({
  advanceAmount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(1, { message: "Request Advance Amount is required." }),
  repaymentPeriod: z.string().min(1, { message: "Repayment Period is required." }),
  reasonForAdvance: z.string().optional(),
});

export default function AdvanceForm({ eligibleAmount = 0 }) { // Default to 0 if undefined
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      advanceAmount: "", // Default value for advance amount
      repaymentPeriod: "",
      reasonForAdvance: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Perform additional submission logic, e.g., API call
  };

  return (
    <Card className="w-2/3 mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Request Advance</CardTitle>
        <CardDescription>Fill in the details below to request an advance.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-4">
          You are eligible for an advance of up to KES {eligibleAmount.toFixed(2)}.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Advance Amount Field */}
            {/* Other Fields */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  );
}

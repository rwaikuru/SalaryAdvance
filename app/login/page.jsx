"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import supabase from "../../lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../lib/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState(null);
  const form = useForm();
  const router = useRouter();
  const { setUserEmail, setUserRole } = useAuth(); // Assuming your AuthContext includes setUserRole

  const onSubmit = async (data) => {
    const { email, password } = data;

    // Query the employees table for the user with the provided email and password
    const { data: userData, error: queryError } = await supabase
      .from('employees')
      .select('email, role')
      .eq('email', email)
      .eq('password', password) // Replace with hashed password comparison if using encryption
      .single();

    if (queryError || !userData) {
      setError('Invalid email or password');
      return;
    }

    // If user exists, set email and role in AuthContext
    setError(null);
    setUserEmail(userData.email);
    setUserRole(userData.role);

    // Redirect based on role, e.g., to the dashboard
    router.push('/Dashboard');
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-8">
        <Image
          src="/logos.png"
          alt="Illustration"
          width={500}
          height={500}
          className=""
        />
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Salary Advance</h2>
        <p className="text-gray-600 mt-2 text-center">
          Platform to Keep Track of your Salary Advances
        </p>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <CardHeader className="text-center">
            <Image
              src="/logo.png"
              alt="Illustration"
              width={200}
              height={200}
              className="mb-4"
            />
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Username or email</label>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  {...form.register('email', { required: true })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <Input
                  type="password"
                  placeholder="********"
                  {...form.register('password', { required: true })}
                />
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
                  Forgot password?
                </Link>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-black text-white">Sign in</Button>
            </form>
            <div className="flex items-center my-4">
              <span className="border-t flex-grow border-gray-300"></span>
              <span className="px-2 text-gray-500 text-sm">or</span>
              <span className="border-t flex-grow border-gray-300"></span>
            </div>
            <Button variant="outline" className="w-full">
              <span className="mr-2"></span>
              Sign in with Google
            </Button>
            <p className="text-center text-gray-600 mt-4 text-sm">
              Are you new? <Link href="/signup" className="text-blue-500 hover:underline">Create an Account</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

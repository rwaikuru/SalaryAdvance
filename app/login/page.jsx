"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import supabase from "../../lib/supabaseClient"
import { useRouter } from 'next/navigation'

export default function login() {
  const [eligibleAmount, setEligibleAmount] = useState(0)
  const [error, setError] = useState(null)
  const form = useForm()
  const router = useRouter()


  const onSubmit = async (data) => {
    const { email, password } = data;

    // Fetch employee data from Supabase
    const { data: employeeData, error: fetchError } = await supabase
      .from('employees')
      .select('salary')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (fetchError || !employeeData) {
      setError('Invalid email or password');
      return;
    }

    const eligible = (2 / 3) * employeeData.salary;
    setEligibleAmount(eligible);
    setError(null);

    // Redirect to Dashboard with eligible amount
    router.push({
      pathname: '/Dashboard',
      query: { eligibleAmount: eligible }
    });
}
}
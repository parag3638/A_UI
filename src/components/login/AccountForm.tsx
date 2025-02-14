"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, } from "@/components/ui/input-otp"
import "@/styles/globals.css";


const accountFormSchema = z.object({
  mail: z
    .string().email().regex(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$"), "This email is not registered with us!")
    .min(5, {
      message: "Invalid Mail Id.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
}

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})


export function AccountForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔹 Add loading state
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [value, setValue] = useState("");
  const [mail, setMail] = useState("");

  const router = useRouter()


  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
    setLoading(true); // 🔹 Set loading state
    setError(null);   // 🔹 Reset error
    setMail(data.mail);

    try {
      // 1️⃣ Call Login API (Which Also Sends OTP)
      console.log("🔍 Calling Login API...");
      const response = await axios.post("http://localhost:9000/api/auth/login", {
        email: data.mail,
        password: data.password,
      });

      let token;
      const message = response.data.message; // ✅ Extract success message

      if (message === "Login successful. Admin") {
        token = response.data.token;
        console.log("📝 Storing Admin token...");
        Cookies.set("token", token, { expires: 1 / 24, secure: true }); // 1-hour expiry
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/VaultX");
        return;
      }

      if (message != "Login successful. OTP sent to email.") throw new Error("Error received");

      // 2️⃣ Check if OTP was successfully sent
      if (message.includes("OTP sent")) {
        setOtpSent(true); // ✅ Show OTP input field
      } else {
        throw new Error("OTP sending failed");
      }

    } catch (err: any) {
      console.error("❌ Error in onSubmit:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false); // 🔹 Reset loading state after request
    }
  }

  const otpform = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmitOTP(data: z.infer<typeof FormSchema>) {
    setLoading(true); // 🔹 Show loading state
    setError(null);   // 🔹 Reset errors

    try {
      console.log("🔍 Verifying OTP...");
      const response = await axios.post("http://localhost:9000/mail/verify-otp", {
        email: mail,  // ✅ Pass the stored email
        otp: data.pin,      // ✅ OTP entered by user
      });

      const token = response.data.token; // ✅ Extract token from response
      if (!token) throw new Error("No token received");

      console.log("✅ OTP Verified! Token:", token);

      // 2️⃣ Store token in cookies
      Cookies.set("token", token, { expires: 1 / 24, secure: true }); // ✅ 1-hour expiry

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3️⃣ Redirect user to VaultX
      console.log("🚀 Redirecting to VaultX...");
      router.push("/VaultX");

    } catch (err: any) {
      console.error("❌ OTP Verification Failed:", err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false); // 🔹 Reset loading state
    }
  }



  return (
    <>
      {!otpSent ?
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* 🔹 Show error message */}

            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input className="py-5 text-black border-gray-200 bg-white"
                      autoComplete="on_check"
                      id="custom_autofill"
                      disabled={loading}
                      placeholder="mail@abc.com" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Password</FormLabel>
                  <FormControl>
                    <Input className="py-5 text-black border-gray-200" type={showPassword ? "text" : "password"}
                      autoComplete="off_check"
                      id="custom_autofill"
                      disabled={loading}
                      placeholder="************" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pb-2">
              <div className="flex items-center space-x-2">
                {/* <Checkbox className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white" id="terms" /> */}
                <Checkbox
                  className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                  id="show-password"
                  checked={showPassword}
                  disabled={loading}
                  onCheckedChange={(checked) => setShowPassword(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-[#A1A1A1] font-normal hover:cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  Show Password
                </label>
              </div>
              <div className="text-xs text-black font-medium hover:cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/">
                        Forgot Password?
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Under Development</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div>
              <Button className='w-full hover:bg-[#2F2F31] bg-black py-6 dark:text-[#FFFFFF] rounded-xl text-base font-semibold' disabled={loading} type="submit">
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Form> :

        <Form {...otpform}>
          <form onSubmit={otpform.handleSubmit(onSubmitOTP)} className="space-y-4">
            <FormField
              control={otpform.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} >
                      <InputOTPGroup className="space-x-2 justify-center">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot key={i} index={i} className="w-12 h-12 text-2xl  border-gray-300 rounded-lg text-center" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    OTP sent your registered mail
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full hover:bg-[#2F2F31] bg-black py-6 dark:text-[#FFFFFF] rounded-xl text-base font-semibold' disabled={loading} type="submit">
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Logging in...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      }
    </>
  )
}
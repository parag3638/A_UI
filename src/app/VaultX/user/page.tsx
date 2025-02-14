"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Define Zod Schema for Validation
const RegisterSchema = z
    .object({
        name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    const router = useRouter();
    const [serverMessage, setServerMessage] = useState<string | null>(null);

    // ✅ Submit Form & Call API
    const onSubmit = async (formData: z.infer<typeof RegisterSchema>) => {
        setServerMessage(null); // Reset any previous messages

        try {
            const response = await axios.post("https://abnormal-backend.onrender.com/api/auth/register", formData);
            setServerMessage("Account created successfully!");
            reset();

        } catch (error: any) {
            console.error("Registration Error:", error);
            setServerMessage(error.response?.data?.message || "Failed to create account. Try again.");
        }
    };

    return (
        <div className="w-full">
            <CardHeader className="px-0">
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Enter your details to register</CardDescription>
            </CardHeader>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {serverMessage && (
                        <p className={`text-sm ${serverMessage.startsWith("Account") ? "text-green-600" : "text-red-600"}`}>
                            {serverMessage}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 max-w-1/5">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name")} placeholder="John Doe" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="johndoe@example.com" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>


                    <Button className="w-full mt-6" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

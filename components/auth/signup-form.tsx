"use client";

import {cn} from "@/lib/utils";
import {z} from "zod";
import React, {ComponentProps, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {authClient} from "@/lib/auth-client"; //import the auth client
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {CircleAlert, Loader2} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import InputPasswordStrength from '@/components/ui/input-password-strength';

const signUpSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email().min(2, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function SignUpForm({className, ...props}: ComponentProps<"form">) {
    const route = useRouter(); //use the router to navigate after signup
    const [loading, setLoading] = useState(false); //loading state for the form submission
    const [error, setError] = useState<string | null>(null); //error state for the form submission
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        // Handle form submission logic here
        const {data, error} = await authClient.signUp.email(
            {
                name: values.name,
                email: values.email,
                password: values.password,
            },
            {
                onRequest: (ctx) => {
                    console.log("Request context:", ctx);
                    setLoading(true); //set loading to true when the request is made
                },
                onSuccess: (ctx) => {
                    route.push("/signin");
                    toast.success("Sign up successful! Please log in.");
                    console.log("Sign up successfully", ctx);
                },
                onError: (ctx) => {
                    setError(ctx.error.message); //set the error message if the request fails
                    toast.error(`Sign up failed. ${ctx.error.message}`)
                },
            }
        );
        console.log(data, error);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-6", className)}
                {...props}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Register your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to create a new account
                    </p>
                </div>
                <div className="grid gap-6">
                    {error && (
                        <Alert variant="destructive">
                            <CircleAlert/>
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="example@mail.com" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <InputPasswordStrength {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <Loader2 size={16} className=" animate-spin"/>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Have an account?{" "}
                    <Link href="/signin" className="underline underline-offset-4">
                        Sign In
                    </Link>
                </div>
            </form>
        </Form>
    );
}

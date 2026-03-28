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
import {authClient} from "@/lib/auth-client";
import {CircleAlert, Loader2} from "lucide-react";
import {FaDiscord} from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import InputPassword from "@/components/ui/input-password";

const signInSchema = z.object({
    email: z.string().email().min(2, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function SignInForm({className, ...props}: ComponentProps<"form">) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [githubLoading, setGitHubLoading] = useState(false);
    const [discordLoading, setDiscordLoading] = useState(false);
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signInSchema>) {
        // Handle form submission logic here
        console.log("Form submitted with values:", values);

        const {data, error} = await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
                callbackURL: "/",
                rememberMe: false,
            },
            {
                onRequest: (ctx) => {
                    console.log("Request context:", ctx);
                    setLoading(true);
                },
                onSuccess: (ctx) => {
                    console.log("Sign in successfully", ctx);
                },
                onError: (ctx) => {
                    console.log("Error during sign in", ctx);
                    setError(ctx.error.message);
                    setLoading(false);
                },
            }
        );
        console.log(data, error);
    }

    const signInWithGitHub = async () => {
        const data = await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
            }, {
                onRequest() {
                    setGitHubLoading(true);
                },
            }
        );
        console.log("GitHub sign in data:", data);
    };

    const signInWithDiscord = async () => {
        await authClient.signIn.social({
                provider: "discord",
                callbackURL: "/",
            }, {
                onRequest() {
                    setDiscordLoading(true);
                },
            }
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn("flex flex-col gap-6", className)}
                    {...props}
                >
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Login to your account</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Enter your email below to login to your account
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link href="/forgot-password" className="text-sm underline">
                                            Forgot Password
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <InputPassword placeholder="••••••" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <Loader2 size={16} className="animate-spin"/>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                </form>
            </Form>

            <div
                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
            </div>
            <Button
                variant="outline"
                className="w-full"
                onClick={signInWithGitHub}
                disabled={githubLoading}
            >
                {githubLoading ? (
                    <Loader2 size={16} className=" animate-spin"/>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                fill="currentColor"
                            />
                        </svg>
                        <span className="ml-2">Sign in with GitHub</span>
                    </>
                )}
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={signInWithDiscord}
                disabled={discordLoading}
            >
                {discordLoading ? (
                    <Loader2 size={16} className=" animate-spin"/>
                ) : (
                    <>
                        <FaDiscord/>
                        <span className="ml-2">Sign in with Discord</span>
                    </>
                )}
            </Button>
        </div>
    );
}

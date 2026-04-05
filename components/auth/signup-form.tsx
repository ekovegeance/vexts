"use client";

import React, {ComponentProps, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import InputPassword from "@/components/ui/input-password";
import {SocialSignInButton} from "@/components/auth/social-sign-button";
import {useForm} from "@tanstack/react-form-nextjs";
import {SignUpFormSchema} from "@/schemas/auth-schema";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {auth} from "@/lib/auth/client";
import {Spinner} from "@/components/ui/spinner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircleIcon} from "lucide-react";
import { toast } from "sonner";
import {useRouter} from "next/navigation";

export function SignUpForm({className, ...props}: ComponentProps<"form">) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: SignUpFormSchema
        },
        onSubmit: async ({value}) => {
            await auth.signUp.email(
                {
                    name: value.name,
                    email: value.email,
                    password: value.password,
                },
                {
                    onRequest: () => {
                        setLoading(true);
                    },
                    onSuccess:() =>{
                        setLoading(false);
                        toast.success("Account created successfully! Please check your email to verify your account.");
                        router.push("/signin")
                    },
                    onError: (ctx) => {                        setError(ctx.error.message);
                        setLoading(false);
                        setError(ctx.error.message);
                    } },
            );
        }
    })


    return (
        <div className={`flex flex-col gap-6 ${className ?? ""}`}>
            <form
                id="sign-up-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit()
                }}
            >

                <div className="flex flex-col items-center gap-2 text-center mb-8">
                    <h1 className="text-2xl font-bold"> Register your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to create a new account
                    </p>
                </div>
                {error && (
                    <Alert variant="destructive" className="max-w-md mb-4">
                        <AlertCircleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}
                <FieldGroup>
                    <form.Field name="name">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Enter your name"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    <form.Field name="email">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Enter your email"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <InputPassword
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Enter your password"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors}/>
                                    )}
                                </Field>
                            )
                        }}
                    </form.Field>
                </FieldGroup>
                <div className="flex w-full justify-end">
                    <Button
                        type="submit"
                        form="sign-up-form"
                        className="mt-4 w-full"
                    >
                        {loading ? <Spinner/> : null}
                        Sign Up
                    </Button>
                </div>

                <div className="text-center text-sm mt-4">
                    Have an account?{" "}
                    <Link href="/signin" className="underline underline-offset-4">
                        Sign In
                    </Link>
                </div>

            </form>

            <div
                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
            </div>
            <SocialSignInButton provider="google"/>
        </div>
    );
}

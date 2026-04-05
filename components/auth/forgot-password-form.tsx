"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth/client";
import React, { useState } from "react";
import { toast } from "sonner";
import {AlertCircleIcon} from "lucide-react";
import {useForm} from "@tanstack/react-form-nextjs";
import {ForgotPasswordSchema} from "@/schemas/auth-schema";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Spinner} from "@/components/ui/spinner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";



export function ForgotPasswordForm({className, ...props}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
      defaultValues: {
          email: "",
      },
      validators: {
          onSubmit: ForgotPasswordSchema
      },
        onSubmit: async ({value}) => {

            await auth.requestPasswordReset(
                {
                    email: value.email,
                    redirectTo: "/reset-password",
                },
                {
                    onRequest: (ctx) => {
                        setLoading(true);
                    },
                    onSuccess: (ctx) => {
                        console.log("Password reset link sent successfully", ctx);
                        setLoading(false);
                        toast.success("Password reset link sent! Please check your email.");
                    },
                    onError: (ctx) => {
                        setError(ctx.error.message);
                        console.log(ctx.error)
                        setLoading(false);
                    },
                }
            );
        }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to reset your password. We will send you a
            link to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form
                id="forgot-password-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit()
                }}
            >
                {error && (
                    <Alert variant="destructive" className="max-w-md mb-4">
                        <AlertCircleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

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
            <div className="flex w-full justify-end">
                <Button
                    type="submit"
                    form="forgot-password-form"
                    className="mt-4 w-full"
                >
                    {loading ? <Spinner/> : null}
                    Send Reset Link
                </Button>
            </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}

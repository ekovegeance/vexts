"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form-nextjs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth/client";
import { toast } from "sonner";
import React, { useState } from "react";
import {ResetPasswordSchema} from "@/schemas/auth-schema";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircleIcon} from "lucide-react";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Spinner} from "@/components/ui/spinner";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
      defaultValues:{
            password: "",
      },
      validators: {
          onSubmit: ResetPasswordSchema
      },
      onSubmit: async ({value}) => {
            const token = new URLSearchParams(window.location.search).get("token");
            if (!token) {
                setError("No token found in the URL")
                return;
            }

          await auth.resetPassword(
              {
                  newPassword: value.password,
                  token: token,
              },
              {
                  onRequest: () => {
                      setLoading(true);
                  },
                  onSuccess: () => {
                      setLoading(false);
                      toast.success(
                          "Password reset successfully. You can now log in with your new password."
                      );
                  },
                  onError: (ctx) => {
                        setError(ctx.error.message);
                  },
              }
          );
      }
  })


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it is at least 6 characters
            long.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form
                id="reset-password-form"
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

                <form.Field name="password">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
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
                        form="reset-password-form"
                        className="mt-4 w-full"
                    >
                        {loading ? <Spinner/> : null}
                        Reset Password
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { z } from "zod";

export const SignUpFormSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email().min(2, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const SignInFormSchema  = SignUpFormSchema.omit({name: true});
export const ForgotPasswordSchema = SignUpFormSchema.omit({name: true, password: true});
export const ResetPasswordSchema = SignUpFormSchema.omit({name: true, email: true});
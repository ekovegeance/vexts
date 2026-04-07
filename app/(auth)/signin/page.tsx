import React from 'react';
import {SignInForm} from "@/components/auth/signin-form";
import Link from "next/link";
import {PlaceholderPattern} from "@/components/ui/placeholder-pattern";
import AppLogoIcon from "@/components/app-logo-icon";

export default function SignInPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <AppLogoIcon/>
                        vexts
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignInForm/>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <PlaceholderPattern
                    className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20"/>
            </div>
        </div>
    );
}
import React from 'react';
import Link from "next/link";
import {SignUpForm} from "@/components/auth/signup-form";
import { AudioWaveform } from "lucide-react";
import {PlaceholderPattern} from "@/components/ui/placeholder-pattern";

export default function SignUpPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div
                            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <AudioWaveform className="size-4"/>
                        </div>
                        vexts
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignUpForm/>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </div>
    );
}
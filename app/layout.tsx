import type {Metadata} from "next";
import {Geist, Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import React, {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider"
import {cn} from "@/lib/utils";
import {env} from "@/lib/env";
import {TRPCProvider} from "@/trpc/client";

const geist = Geist({subsets: ['latin'], variable: '--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: env.NEXT_PUBLIC_APP_NAME,
    description: "An example application using Better Auth",
};

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
        <body
            className={`${plusJakartaSans.className} ${plusJakartaSans.className} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TRPCProvider>
                {children}
            </TRPCProvider>
            <Toaster richColors={true}/>
        </ThemeProvider>
        </body>
        </html>
    );
}

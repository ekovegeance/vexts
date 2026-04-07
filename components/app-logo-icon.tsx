"use client";

import { cn } from "@/lib/utils";
import { AudioWaveform} from "lucide-react";

export default function AppLogoIcon({className, ...props}: { className?: string; }) {
    return <AudioWaveform className={cn(className)} {...props} />;
}

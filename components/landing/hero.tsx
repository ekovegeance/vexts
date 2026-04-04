import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Author } from "@/components/landing/author";
import { FileCode2 } from "lucide-react";
import { SiVercel } from "react-icons/si";

export default function Hero() {
    return (
        <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-center gap-2 text-center">
                <h1 className="font-semibold text-4xl tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl">
                    vexts
                </h1>
                <p className="mt-6 text-foreground/80 md:text-lg">
                    Production-ready opinionated stater kit with Next.js end to end typesafe
                </p>
                <p className="max-w-[750px] text-md text-muted-foreground">
                    Powered by <Author />
                </p>
            </div>
            <div className="grid grid-cols md:grid-cols-2 gap-4">
                <div>
                    <Button size="lg">
                        <FileCode2 />
                        <Link href="https://github.com/ekovegeance/vexts">
                            Get Started
                        </Link>
                    </Button>
                </div>
                <div>
                    <Button size="lg" variant="secondary">
                        <SiVercel />
                        <Link href="https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fekovegeance%2Fvexts">
                            Deploy Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
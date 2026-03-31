import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Author } from "@/components/landing/author";
import { FileCode2, Triangle } from "lucide-react";

export default function Hero() {
    return (
        <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-center gap-2 text-center">
                <h1 className="text-5xl/[1.1] font-extrabold md:text-5xl lg:text-6xl lg:leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-primary to-zinc-600">
                    vexts
                </h1>
                <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                    Production-ready opinionated stater kit with Next.js end to end type safety
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
                        <Triangle />
                        <Link href="https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fekovegeance%2Fvexts">
                            Deploy Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
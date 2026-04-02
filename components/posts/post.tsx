"use client";
import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {formatDate} from "@/lib/utils";
import Image from "next/image";
import postImage from "@/public/post.png"
import {trpc} from "@/trpc/client";

export default function Post() {
    const { data: posts} = trpc.post.list.useQuery({ limit: 6, offset: 0 });
    return (
        <section>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {posts?.map((post, index) => (
                    <Link href={post.title} key={index}>
                        <div>
                            <Image
                                width={1000}
                                height={1000}
                                alt={post.title}
                                className="aspect-[14/9] rounded-lg bg-muted"
                                src={postImage}
                            />
                            <div className="px-1">
                                <h3 className="mt-3 font-semibold text-xl">{post.title}</h3>
                                <div className="mt-4 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                        <CalendarDays className="size-4" />{" "}
                                        {formatDate(post.createdAt.toISOString())}
                                    </div>
                                    <Button className="-me-2" variant="ghost">
                                        Read Article <ArrowRight />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Button className="mx-auto mt-16 flex" size="lg" variant="secondary">
                Load more articles
            </Button>
        </section>
    );
}

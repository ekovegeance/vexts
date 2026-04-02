import React from 'react';
import Post from "@/components/posts/post";
import {Button} from "@/components/ui/button";
import {Mails} from "lucide-react";
import {Separator} from "@/components/ui/separator";

export default function PostsPage() {
    return (
        <div className="mx-auto max-w-screen-xl px-6 py-16">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-balance font-semibold text-4xl tracking-tight">
                        Welcome to our post!
                    </h2>
                    <p className="mt-2 text-balance text-lg text-muted-foreground tracking-normal sm:text-xl">
                        Stay updated with the latest news and insights.
                    </p>
                </div>
                <Button
                    className="hidden gap-3 sm:inline-flex"
                    size="lg"
                    variant="secondary"
                >
                    <Mails />
                    <span className="hidden lg:inline">Subscribe to our newsletter</span>
                    <span className="hidden md:inline lg:hidden">Subscribe</span>
                </Button>
            </div>
            <Separator className="mt-7 mb-10" />
            <Post/>
        </div>
    );
}
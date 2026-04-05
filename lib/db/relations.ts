import { defineRelations } from 'drizzle-orm';
import {user} from "@/lib/db/schema/auth";
import {posts} from "@/lib/db/schema/post";

export const relations = defineRelations({user, posts}, (r) => (
    {
        user: {
            posts: r.many.posts(),
        },
        posts:  {
            author: r.one.user({
                from: r.posts.authorId,
                to: r.user.id,
            })
        }
    }
))
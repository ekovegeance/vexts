import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';
export const relations = defineRelations(schema, (r) => (
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
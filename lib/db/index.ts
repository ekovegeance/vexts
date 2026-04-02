import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";
import { env } from "@/lib/env"
import {relations} from "@/lib/db/relations"

const connection = env.DATABASE_URL
const client = postgres(connection);
export const db = drizzle({client, relations});
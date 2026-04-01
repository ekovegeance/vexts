import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres'

import { env } from "@/lib/env"


const connection = env.DATABASE_URL;
const client = postgres(connection, {prepare: false});

export const db = drizzle(client);



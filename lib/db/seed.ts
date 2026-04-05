import {db} from "@/lib/db"

async function main() {

    const users = await db.query.user.findMany();
    if (users.length > 0) {
        console.log("Users already exist in the database. Skipping seeding.");
        return;
    }
}

main().catch((error) => {
    console.error("Error seeding the database:", error);
    process.exit(1);
});
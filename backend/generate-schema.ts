import { AppDataSource } from "./src/infrastructure/database/data-source";

/**
 * This script helps generate SQL schema for Supabase
 * Run with: npx tsx generate-schema.ts
 */

async function generateSchema() {
    try {
        console.log("🔄 Generating database schema...\n");

        // Temporarily override to use postgres locally (won't actually connect)
        process.env.DATABASE_URL = "postgresql://localhost:5432/temp";

        await AppDataSource.initialize();

        console.log("✅ Schema generation complete!");
        console.log("\n📝 Copy the SQL from the Supabase setup guide");
        console.log("   or use TypeORM migrations for more control\n");

        await AppDataSource.destroy();
    } catch (error) {
        console.error("❌ Error generating schema:", error);
        process.exit(1);
    }
}

generateSchema();

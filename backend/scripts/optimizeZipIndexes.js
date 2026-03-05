import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory (one level up from scripts)
// We must do this BEFORE importing modules that rely on env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

// Dynamic imports to ensure env vars are loaded first
const { default: connectDB } = await import("../db/index.js");
const { default: ZipCode } = await import("../models/zip-code.model.js");

/**
 * Script to audit, drop, and recreate indexes for ZipCode collection.
 * This ensures the collection is optimized for read-heavy workloads.
 */
async function optimizeIndexes() {
  await connectDB();
  console.log("🚀 Starting Index Optimization...");

  try {
    const collection = ZipCode.collection;
    
    // 1. List existing indexes
    const indexes = await collection.indexes();
    console.log("📋 Current Indexes:", indexes.map(idx => idx.name));

    // 2. Drop all indexes except _id (safest way to clear redundancy)
    console.log("🗑️ Dropping non-_id indexes...");
    await collection.dropIndexes();
    console.log("✅ Dropped all indexes.");

    // 3. Recreate optimized indexes
    // Note: We use raw MongoDB driver commands via Mongoose for precise control
    
    console.log("🛠️ Creating new indexes...");

    // Index 1: Unique Zip (Primary Lookup)
    // We make this unique to enforce data integrity at the database level.
    await collection.createIndex(
      { zip: 1 }, 
      { unique: true, name: "zip_unique", background: true }
    );
    console.log("✅ Created unique index on 'zip'");

    // Index 2: Compound Index for City + State (Secondary Lookup)
    // This supports queries like { city: "Los Angeles" } AND { city: "Los Angeles", state: "CA" }
    // We use collation for case-insensitive search if needed, but for now we stick to standard equality
    // to maximize speed.
    await collection.createIndex(
      { city: 1, state: 1 }, 
      { name: "city_state_lookup", background: true }
    );
    console.log("✅ Created compound index on 'city' + 'state'");

    // 4. Verify
    const newIndexes = await collection.indexes();
    console.log("\n✨ Optimization Complete! New Indexes:");
    newIndexes.forEach(idx => {
      console.log(`- ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    process.exit(0);

  } catch (error) {
    console.error("❌ Error optimizing indexes:", error);
    process.exit(1);
  }
}

optimizeIndexes();

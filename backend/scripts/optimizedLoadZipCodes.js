import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env BEFORE imports
dotenv.config({ path: path.join(__dirname, "../.env") });

// Dynamic imports
const { default: connectDB } = await import("../db/index.js");
const { default: ZipCode } = await import("../models/zip-code.model.js");
import { zipCodeBatch1 } from "./loadZipCodeBatch.js";

/**
 * Optimizes bulk insertion of zip codes using bulkWrite and chunking.
 * This ensures high performance and data integrity (no duplicates).
 */
async function optimizedLoadZipCodes() {
  await connectDB();
  console.log("🚀 Starting optimized bulk load...");

  // 1. Prepare Data Source (In production, this could be a stream from a file)
  // We'll simulate a large dataset by duplicating the batch if needed, 
  // but for now we just use the imported batch.
  const rawData = zipCodeBatch1; 
  
  // 2. Parse Data (Generator function for memory efficiency)
  function* dataParser(data) {
    const lines = data.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      const [zip, city, county] = line.split('\t').map(item => item.trim());
      yield {
        zip,
        city,
        county,
        state: 'CA'
      };
    }
  }

  // 3. Process in Chunks
  const CHUNK_SIZE = 1000;
  let chunk = [];
  let totalProcessed = 0;
  let totalInserted = 0;
  let totalUpdated = 0;

  const parser = dataParser(rawData);
  const operations = [];

  console.time("Bulk Load Duration");

  for (const record of parser) {
    // Create bulk operation
    operations.push({
      updateOne: {
        filter: { zip: record.zip },
        update: { $set: record },
        upsert: true
      }
    });

    if (operations.length >= CHUNK_SIZE) {
      const result = await ZipCode.bulkWrite(operations, { ordered: false });
      totalInserted += result.upsertedCount;
      totalUpdated += result.modifiedCount;
      totalProcessed += operations.length;
      console.log(`✅ Processed ${totalProcessed} records...`);
      operations.length = 0; // Clear array
    }
  }

  // Process remaining operations
  if (operations.length > 0) {
    const result = await ZipCode.bulkWrite(operations, { ordered: false });
    totalInserted += result.upsertedCount;
    totalUpdated += result.modifiedCount;
    totalProcessed += operations.length;
  }

  console.timeEnd("Bulk Load Duration");
  console.log(`🎉 Finished!`);
  console.log(`📊 Total Processed: ${totalProcessed}`);
  console.log(`📥 Inserted (New): ${totalInserted}`);
  console.log(`🔄 Updated (Existing): ${totalUpdated}`);

  process.exit(0);
}

optimizedLoadZipCodes().catch(err => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});

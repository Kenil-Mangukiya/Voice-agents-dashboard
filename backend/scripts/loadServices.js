import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const { default: connectDB } = await import("../db/index.js");
const { default: Service } = await import("../models/country-service.model.js");

/* =========================================================
   HELPERS
========================================================= */

/** Strict county header detection
 * Only matches:
 *  LOS ANGELES COUNTY
 *  ORANGE COUNTY
 */
function isCountyHeader(line) {
  return /^[A-Z\s]+COUNTY$/.test(line);
}

/** Normalize county name */
function normalizeCounty(name) {
  return name
    .replace(/county/i, "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

/** Normalize phone to E.164 */
function normalizePhone(raw) {
  if (!raw) return null;

  // Remove all non-digit characters
  let digits = raw.replace(/\D/g, "");

  if (!digits) return null;

  const shortCodes = ["911", "988", "211", "311", "511", "711", "811"];

  // 1. Handle Short Emergency Codes (3 digits)
  // Check if it's exactly 3 digits (e.g., "911", "988")
  // OR if it's "1" + 3 digits (e.g., "1911", "1988") which might happen if country code 1 was prepended
  if (digits.length === 3) {
    if (shortCodes.includes(digits)) return "+" + digits; // Return +911, +988
  }
  
  if (digits.length === 4 && digits.startsWith("1")) {
    const shortCode = digits.substring(1);
    if (shortCodes.includes(shortCode)) return "+" + shortCode; // Return +911, +988
  }

  // 2. Handle Regular US Numbers
  // If 10 digits, add country code
  if (digits.length === 10) digits = "1" + digits;

  // 3. Validation
  // E.164 says max 15 digits. US numbers with code are 11.
  if (digits.length < 10 || digits.length > 15) {
    // It's not a short code (handled above) and not a valid long number
    return null;
  }

  return "+" + digits;
}

/** Assign priority */
function detectPriority(serviceName, phone) {
  const name = serviceName.toLowerCase();

  if (phone === "+911") return 10;
  if (phone === "+988") return 9;
  if (phone === "+211" || phone === "+311") return 5;
  if (name.includes("crisis")) return 8;
  if (name.includes("suicide")) return 9;

  return 1;
}

/* =========================================================
   LOADER
========================================================= */

async function loadServices() {
  console.log("🔌 Connecting to DB...");
  await connectDB();
  console.log("✅ DB Connected\n");

  const rawFilePath = path.join(__dirname, "../data/services_raw.txt");

  if (!fs.existsSync(rawFilePath)) {
    console.error("❌ File not found:", rawFilePath);
    process.exit(1);
  }

  console.log("📄 Reading dataset...");
  const content = fs.readFileSync(rawFilePath, "utf8");
  const lines = content.split(/\r?\n/);

  console.log(`📊 Total lines: ${lines.length}\n`);

  let currentCounty = null;
  let operations = [];
  let inserted = 0;
  let skipped = 0;
  const BATCH = 100;

  console.log("🧹 Clearing old collection...");
  await Service.deleteMany({});
  
  // Drop the old index if it exists to fix the duplicate key error
  try {
    await Service.collection.dropIndex("county_1_state_1_phone_1");
    console.log("🗑️ Dropped old unique index: county_1_state_1_phone_1");
  } catch (e) {
    // Index might not exist, which is fine
  }
  
  // Create the new index manually to be sure
  try {
    await Service.collection.createIndex(
      { county: 1, state: 1, phone: 1, serviceName: 1 }, 
      { unique: true, name: "unique_service_phone_name" }
    );
    console.log("✅ Created new unique index: unique_service_phone_name");
  } catch (e) {
    console.error("⚠️ Failed to create index:", e.message);
  }

  console.log("✅ Cleared & Re-indexed\n");

  console.log("🚀 Starting parse...\n");

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    /* ---------- COUNTY HEADER ---------- */

    if (isCountyHeader(line)) {
      currentCounty = normalizeCounty(line);
      console.log(`📍 County → ${currentCounty}`);
      continue;
    }

    if (!currentCounty) {
      skipped++;
      continue;
    }

    /* ---------- SPLIT PHONE + DESC ---------- */

    let parts = line.split("—");

    if (parts.length < 2)
      parts = line.split(" - ");

    if (parts.length < 2) {
      console.log("⚠ Skipped malformed:", line);
      skipped++;
      continue;
    }

    const phonePart = parts[0].trim();
    const descFull = parts.slice(1).join("—").trim();

    console.log(`📞 Raw phone part → ${phonePart}`);
    console.log(`📝 Description → ${descFull}`);

    /* ---------- SERVICE NAME + DESCRIPTION ---------- */

    let serviceName = descFull;
    let description = "";

    const match = descFull.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (match) {
      serviceName = match[1].trim();
      description = match[2].trim();
    }

    console.log(`🏷 Service: ${serviceName}`);
    if (description) console.log(`📄 Details: ${description}`);

    /* ---------- SPLIT MULTIPLE PHONES ---------- */

    const rawPhones = phonePart
      .replace(/\(toll(-free)?\)/gi, "")
      .split(/\/| or /i)
      .map(p => p.trim());

    console.log(`☎ Parsed phones → [ '${rawPhones.join("', '")}' ]`);

    for (const rawPhone of rawPhones) {
      const phone = normalizePhone(rawPhone);

      if (!phone) {
        console.log(`⚠ Skipped invalid phone: ${rawPhone}`);
        skipped++;
        continue;
      }

      const priority = detectPriority(serviceName, phone);

      console.log(`✅ Normalized phone: ${phone} Priority: ${priority}`);

      operations.push({
        updateOne: {
          filter: {
            county: currentCounty,
            state: "CA",
            phone,
            // Add serviceName to filter if phone is same but service is different
            // e.g. 988 is "Suicide Lifeline" AND "Veterans Crisis Line"
            serviceName
          },
          update: {
            $set: {
              county: currentCounty,
              state: "CA",
              phone,
              rawPhone,
              serviceName,
              description,
              priority
            }
          },
          upsert: true
        }
      });

      inserted++;
    }

    /* ---------- BATCH WRITE ---------- */

    if (operations.length >= BATCH) {
      await Service.bulkWrite(operations, { ordered: false });
      process.stdout.write(".");
      operations = [];
    }
  }

  /* ---------- FINAL WRITE ---------- */

  if (operations.length) {
    await Service.bulkWrite(operations, { ordered: false });
  }

  console.log("\n\n✅ IMPORT COMPLETE");
  console.log("Inserted:", inserted);
  console.log("Skipped:", skipped);
  console.log("Total processed:", lines.length);

  process.exit(0);
}

loadServices().catch(err => {
  console.error("❌ Fatal Loader Error:", err);
  process.exit(1);
});
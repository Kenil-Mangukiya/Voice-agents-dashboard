import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, "../.env") });

// Dynamic imports
const { default: connectDB } = await import("../db/index.js");
const { default: Service } = await import("../models/country-service.model.js");
const { default: ZipCode } = await import("../models/zip-code.model.js");

/**
 * Service Lookup Script
 * Usage: node lookupServices.js <ZIP_CODE>
 */
async function lookupServices() {
  const args = process.argv.slice(2);
  const zip = args[0];

  if (!zip) {
    console.error("❌ Usage: node backend/scripts/lookupServices.js <ZIP_CODE>");
    process.exit(1);
  }

  await connectDB();
  console.log(`🔎 Searching services for ZIP: ${zip}...`);

  try {
    // 1. Find Zip Code Info
    // Note: ZipCode model might store zip as string, ensure consistent type
    const zipDoc = await ZipCode.findOne({ zip: zip }).lean();
    
    if (!zipDoc) {
      console.error(`❌ Zip code '${zip}' not found in 'zipcodes' collection.`);
      console.log("   (Make sure you have loaded zip codes first)");
      process.exit(1);
    }

    const { county, state, city } = zipDoc;
    // Normalized lookup: County in Service model is UPPERCASE
    const countyUpper = county.toUpperCase();
    const stateUpper = (state || "CA").toUpperCase();

    console.log(`📍 Found Location: ${city}, ${county} County, ${state}`);

    // 2. Find Services for this County
    // Sort by Priority (desc) then Service Name (asc)
    const services = await Service.find({ 
      county: countyUpper, 
      state: stateUpper 
    })
    .sort({ priority: -1, serviceName: 1 }) // Priority descending
    .lean();

    if (services.length === 0) {
      console.log(`⚠️ No services found for ${countyUpper} County.`);
    } else {
      console.log(`\n🚑 Found ${services.length} Services for ${countyUpper}:\n`);
      
      // Print Header
      console.log(`${"PRIORITY".padEnd(10)} | ${"SERVICE NAME".padEnd(45)} | ${"PHONE".padEnd(20)} | ${"DESCRIPTION"}`);
      console.log("-".repeat(120));

      services.forEach(svc => {
        let priorityLabel = "NORMAL";
        if (svc.priority >= 10) priorityLabel = "🚨 URGENT";
        else if (svc.priority >= 8) priorityLabel = "🔥 HIGH";
        else if (svc.priority >= 5) priorityLabel = "⚡ MED";

        console.log(
          `${priorityLabel.padEnd(10)} | ` +
          `${svc.serviceName.substring(0, 43).padEnd(45)} | ` +
          `${svc.phone.padEnd(20)} | ` +
          `${(svc.description || "").substring(0, 40)}`
        );
      });
    }

    process.exit(0);

  } catch (error) {
    console.error("❌ Error looking up services:", error);
    process.exit(1);
  }
}

lookupServices();

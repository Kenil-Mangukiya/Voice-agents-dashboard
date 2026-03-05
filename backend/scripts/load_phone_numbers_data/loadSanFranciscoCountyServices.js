import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const { default: connectDB } = await import("../../db/index.js");
const { default: Service } = await import("../../models/county-service.model.js");

/* =========================================================
   PHONE VALIDATION HELPER
========================================================= */

/**
 * Validate phone format for database storage
 */
function isValidPhone(phone) {
  if (!phone) return false;

  const digits = phone.replace(/\D/g, "");

  // Must have between 3-15 digits (short codes to international)
  return digits.length >= 3 && digits.length <= 15;
}

/* =========================================================
   SAN FRANCISCO COUNTY SERVICES LOADER
========================================================= */

async function loadSanFranciscoCountyServices() {
  try {
    console.log("\n");
    console.log("═".repeat(66));
    console.log("📍 SAN FRANCISCO COUNTY - Services Loader");
    console.log("═".repeat(66));
    console.log();

    // Connect to database
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB Connected\n");

    // Path to the JSON file
    const jsonFilePath = path.join(
      __dirname,
      "../../db/phone_numbers_data/san-francisco-county-services.json"
    );

    if (!fs.existsSync(jsonFilePath)) {
      console.error(`❌ File not found: ${jsonFilePath}`);
      process.exit(1);
    }

    console.log(`📄 Reading San Francisco County services JSON...`);
    const rawData = fs.readFileSync(jsonFilePath, "utf8");
    const servicesData = JSON.parse(rawData);

    if (!Array.isArray(servicesData)) {
      console.error("❌ JSON is not an array");
      process.exit(1);
    }

    console.log(`📊 Found ${servicesData.length} services to load\n`);

    // Clear existing data for San Francisco County
    console.log("🧹 Clearing existing SAN FRANCISCO services...");
    const deleteResult = await Service.deleteMany({
      county: "SAN FRANCISCO",
      state: "CA",
    });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} old records\n`);

    // Process and validate data
    console.log("⚙️  Processing and validating data...");
    let validServices = [];
    let skippedCount = 0;

    for (let i = 0; i < servicesData.length; i++) {
      const item = servicesData[i];
      let errors = [];

      // Validate required fields
      if (!item.county) errors.push("county");
      if (!item.state) errors.push("state");
      if (!item.serviceName) errors.push("serviceName");
      if (!item.phone) errors.push("phone");

      if (errors.length > 0) {
        console.warn(
          `⚠️  Row ${i + 1}: Missing ${errors.join(", ")}`
        );
        skippedCount++;
        continue;
      }

      // Validate phone format
      if (!isValidPhone(item.phone)) {
        console.warn(
          `⚠️  Row ${i + 1}: Invalid phone format - "${item.phone}" for "${item.serviceName}"`
        );
        skippedCount++;
        continue;
      }

      // Build service object - preserve all fields exactly
      const service = {
        county: item.county.toUpperCase().trim(),
        state: (item.state || "CA").toUpperCase().trim(),
        serviceName: item.serviceName.trim(),
        phone: item.phone.trim(),
        description: (item.description || item.serviceName).trim(),
        priority: item.priority || 5,
        citySpecific: item.citySpecific || false,
        isShortCode: item.isShortCode || false,
      };

      validServices.push(service);
    }

    console.log(`✅ Validated ${validServices.length} services (skipped ${skippedCount})\n`);

    // Batch insert
    if (validServices.length > 0) {
      console.log("📤 Inserting services into database...");
      const BATCH_SIZE = 50;
      let insertedCount = 0;

      for (let i = 0; i < validServices.length; i += BATCH_SIZE) {
        const batch = validServices.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(validServices.length / BATCH_SIZE);

        try {
          const result = await Service.insertMany(batch, { ordered: false });
          insertedCount += result.length;
          console.log(
            `✅ Batch ${batchNum}/${totalBatches}: Inserted ${result.length} services`
          );
        } catch (error) {
          // Handle duplicate key errors gracefully
          if (error.code === 11000) {
            let duplicateCount = 0;

            // Try inserting each item individually to skip duplicates
            for (const item of batch) {
              try {
                await Service.create(item);
                insertedCount++;
              } catch (e) {
                if (e.code === 11000) {
                  duplicateCount++;
                } else {
                  console.error(
                    `❌ Error inserting "${item.serviceName}":`,
                    e.message
                  );
                }
              }
            }

            if (duplicateCount > 0) {
              console.warn(
                `⚠️  Batch ${batchNum}/${totalBatches}: Skipped ${duplicateCount} duplicates`
              );
            }
          } else {
            throw error;
          }
        }
      }

      // Verify final count
      const finalCount = await Service.countDocuments({
        county: "SAN FRANCISCO",
        state: "CA",
      });

      // Get breakdown by priority
      const byPriority = await Service.aggregate([
        { $match: { county: "SAN FRANCISCO", state: "CA" } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      console.log(`\n${"═".repeat(66)}`);
      console.log(`✅ LOAD COMPLETE!`);
      console.log(`${"═".repeat(66)}`);
      console.log(`Total services inserted: ${insertedCount}`);
      console.log(`Total SAN FRANCISCO services in database: ${finalCount}\n`);

      console.log("📊 Services Summary by Priority:");
      const priorityLabels = {
        1: "🚨 Emergency/Crisis",
        2: "⚠️  High Priority",
        3: "📌 Medium Priority",
        4: "📋 Standard Services",
        5: "📝 Administrative",
      };

      byPriority.forEach((item) => {
        const label = priorityLabels[item._id] || `Priority ${item._id}`;
        console.log(`   ${label}: ${item.count} services`);
      });

      console.log();
      console.log("✅ Ready to query by:");
      console.log("   • County: 'SAN FRANCISCO'");
      console.log("   • Priority: 1-5");
      console.log("   • Service Name: Full text search");
      console.log();
    } else {
      console.log("⚠️  No valid services to insert");
    }

    console.log("🎉 San Francisco County services loaded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error loading San Francisco County services:");
    console.error("Message:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

// Run the loader
loadSanFranciscoCountyServices();

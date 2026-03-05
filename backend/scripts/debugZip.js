
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const { default: connectDB } = await import("../db/index.js");
const { default: ZipCode } = await import("../models/zip-code.model.js");

async function checkZip() {
  await connectDB();
  console.log("Checking for zip 90001...");
  
  const exact = await ZipCode.findOne({ zip: "90001" });
  console.log("Exact match:", exact);
  
  const regex = await ZipCode.findOne({ zip: /90001/ });
  console.log("Regex match:", regex);

  const count = await ZipCode.countDocuments();
  console.log("Total zip codes:", count);

  process.exit(0);
}

checkZip();

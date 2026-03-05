import CountyService from "../models/county-service.model.js";
import ZipCode from "../models/zip-code.model.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Get services by zip code
 */
export const getServicesByZip = async (req, res, next) => {
  try {
    const zip = req.body.args.zip;
    if (!zip) return res.status(400).json({ message: "zip required" });

    const zipDoc = await ZipCode.findOne({ zip: zip.toString() }).lean();
    if (!zipDoc) return res.status(404).json({ message: "Zip code not found" });

    // Expect county field in ZipCode to be Title Case matching CountyService.county
    const countyName = zipDoc.county;
    const countyService = await CountyService.findOne({ county: countyName }).lean();
    if (!countyService) return res.status(404).json({ message: "County services not found" });

    return res.json({ county: countyName, city: zipDoc.city, services: countyService.serviceCategories });
  } catch (err) {
    next(err);
  }
};

/**
 * Get zip code information with available services
 * Returns zip code, city, county, and all services available in that area
 * Status 200 with success: true if found
 * Status 200 with success: false if not found
 */
export const getZipCodeInfo = asyncHandler(async (req, res) => {
  console.log("🔍 Received request for zip code info");
  console.log("📦 Request body:", req.body);
  const zip  = req.body.args.zip;
  console.log(`🔍 Looking up zip code info for: ${zip}`);

  if (!zip || zip.trim() === "") {
    return res.status(200).json(
      new apiResponse(200, { success: false }, "Zip code is required")
    );
  }

  const zipDoc = await ZipCode.findOne({ zip: zip.toString().trim() }).lean();

  if (!zipDoc) {
    return res.status(200).json(
      new apiResponse(200, { success: false }, "Zip code not found")
    );
  }

  // Get all services available for this county (case-insensitive match)
  const services = await CountyService.find(
    { county: { $regex: `^${zipDoc.county}$`, $options: "i" }, state: "CA" },
    { serviceName: 1, phone: 1, description: 1, priority: 1, isShortCode: 1, _id: 0 }
  )
    .sort({ priority: 1 })
    .lean();

  console.log(`✅ Found zip code info for ${zip}: ${zipDoc.city}, ${zipDoc.county}`);
  console.log(`📊 Found ${services.length} services for county ${zipDoc.county}\n`);

  // Return zip code info with services
  const responseData = {
    success: true,
    zip: zipDoc.zip,
    city: zipDoc.city,
    county: zipDoc.county,
    services: services && services.length > 0 ? services : [],
  };

  return res.status(200).json(
    new apiResponse(200, responseData, "Zip code and services found")
  );
});

export default { getServicesByZip, getZipCodeInfo };

import CountyService from "../models/county-service.model.js";
import ZipCode from "../models/zip-code.model.js";

export const getServicesByZip = async (req, res, next) => {
  try {
    const zip = req.params.zip;
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

export default { getServicesByZip };

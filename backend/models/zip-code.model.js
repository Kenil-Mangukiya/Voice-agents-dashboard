import mongoose from "mongoose";

const zipCodeSchema = new mongoose.Schema(
  {
    zip: {
      type: String,
      required: true,
      unique: true, // Creates a unique index on 'zip'
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    county: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: "CA",
      required: true,
      trim: true,
    },
  },
  { 
    timestamps: false, // Metadata overhead removed for read-heavy static data
    versionKey: false // Remove __v field to save space
  }
);

// Compound index for frequent city+state lookups
// This covers queries on { city: "..." } AND { city: "...", state: "..." }
zipCodeSchema.index({ city: 1, state: 1 });

const ZipCode = mongoose.model("ZipCode", zipCodeSchema);

export default ZipCode;

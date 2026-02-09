import mongoose from "mongoose";

const zipCodeSchema = new mongoose.Schema(
  {
    zip: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    county: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      default: "CA",
    },
  },
  { timestamps: true }
);

const ZipCode = mongoose.model("ZipCode", zipCodeSchema);

export default ZipCode;

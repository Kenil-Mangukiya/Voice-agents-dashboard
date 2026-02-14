import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
  {
    e164: { type: String },
    display: { type: String }
  },
  { _id: false }
);

const serviceEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phones: { type: [phoneSchema], default: [] },
    description: { type: String },
    keywords: { type: [String], default: [] },
    source: { type: String }
  },
  { _id: false }
);

const countyServiceSchema = new mongoose.Schema(
  {
    county: { type: String, required: true, index: true, unique: true },
    state: { type: String, default: "CA" },
    serviceCategories: {
      type: Map,
      of: [serviceEntrySchema],
      default: {}
    }
  },
  { timestamps: true }
);

countyServiceSchema.index({ county: 1, state: 1 });

const CountyService = mongoose.model("CountyService", countyServiceSchema);

export default CountyService;

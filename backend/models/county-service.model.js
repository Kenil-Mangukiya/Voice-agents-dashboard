import mongoose from "mongoose";

/**
 * Service Schema for 'county_services' collection
 * Optimized for county-based service lookup without category restrictions
 */
const serviceSchema = new mongoose.Schema(
  {
    county: {
      type: String,
      required: [true, "County is required"],
      trim: true,
      uppercase: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      default: "CA",
      trim: true,
      uppercase: true,
      index: true,
    },
    serviceName: {
      type: String,
      required: [true, "Service name required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number required"],
      trim: true,
      // E.164 format validation (US numbers)
      match: [/^\+?1?[0-9]{10}$/],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 5, // Default LOWEST priority
      index: true,
    },
    citySpecific: {
      type: Boolean,
      default: false, // false = county-wide, true = Hanford/Lemoore specific
    },
    isShortCode: {
      type: Boolean, 
      default: false, // true for 911, 988, 211
    }
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "county_services"
  }
);

// 🔥 PERFECT INDEXES for production queries:
/** 1. PRIMARY: County + State + Priority (fastest lookup) */
serviceSchema.index({ county: 1, state: 1, priority: -1 });

/** 2. County-only lookup (get all services) */
serviceSchema.index({ county: 1, state: 1 });

/** 3. Fast phone verification */
serviceSchema.index({ county: 1, state: 1, phone: 1 });

/** 4. Service name search */
serviceSchema.index({ county: 1, serviceName: "text" });

const Service = mongoose.model("Service", serviceSchema);

export default Service;

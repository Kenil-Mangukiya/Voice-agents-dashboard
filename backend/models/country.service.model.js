import mongoose from "mongoose";

const countyServiceSchema = new mongoose.Schema(
  {
    countyName: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      default: "CA",
    },
    services: [
      {
        categoryId: {
          type: String,
          required: true,
        },
        categoryName: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        items: [
          {
            serviceName: {
              type: String,
              required: true,
            },
            phone: {
              type: String,
              required: true,
            },
            description: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CountyService = mongoose.model("county_services", countyServiceSchema);

export default CountyService;


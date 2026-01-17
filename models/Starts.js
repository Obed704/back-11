import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    target: { type: Number, required: true },
    color: { type: String, default: "rgb(247,244,46)" }, // text color
    plus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const statsSettingsSchema = new mongoose.Schema(
  {
    stats: [statSchema],
    backgroundColor: { type: String, default: "bg-black" },
  },
  { timestamps: true }
);

const StatsSettings = mongoose.model("StatsSettings", statsSettingsSchema);
export default StatsSettings;

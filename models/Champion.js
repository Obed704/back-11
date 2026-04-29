import mongoose from "mongoose";

const championSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    season: { type: String, required: true, trim: true },
    year: { type: Number, required: true, index: true },
    description: { type: String, default: "", trim: true },
    roadToVictory: { type: String, default: "", trim: true },
    image: { type: String, default: null },
    alt: { type: String, default: "", trim: true },
    showHeader: { type: Boolean, default: true },
    rank: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-extract year from season string before every save
championSchema.pre("save", function (next) {
  if (this.isModified("season") || !this.year) {
    const match = this.season.match(/(\d{4})/);
    this.year = match ? parseInt(match[1]) : new Date().getFullYear();
  }
  next();
});

// Keep year in sync on findOneAndUpdate (used by PUT route)
championSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update?.season) {
    const match = update.season.match(/(\d{4})/);
    if (match) update.year = parseInt(match[1]);
  }
  next();
});

export default mongoose.model("Champion", championSchema);
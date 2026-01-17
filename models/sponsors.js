import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  gradient: { type: String, required: true },
  btnColor: { type: String, required: true },
}, { timestamps: true });

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
export default Sponsor;

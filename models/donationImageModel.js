import mongoose from "mongoose";

const donationImageSchema = new mongoose.Schema({
  side: {
    type: String,
    enum: ["left", "right"],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const DonationImage = mongoose.model("DonationImage", donationImageSchema);
export default DonationImage;

import mongoose from "mongoose";

const getInvolvedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true }, // path to image (e.g. /getInvolved/image.jpg)
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
  buttonColor: { type: String, default: "bg-blue-500 hover:bg-blue-700" },
});

const GetInvolved = mongoose.model("GetInvolved", getInvolvedSchema);

export default GetInvolved;

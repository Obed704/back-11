// controllers/bannerController.js
import Banner from "../models/BannerChampions.js";
import Champion from "../models/Champion.js";

// Get banner (with first champion image)
export const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    const champion = await Champion.findOne().sort({ _id: 1 });

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Dynamically set image from first champion
    const bannerWithImage = {
      ...banner.toObject(),
      image: champion ? champion.image : banner.image,
    };

    res.json(bannerWithImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create or update banner
export const updateBanner = async (req, res) => {
  try {
    const { title, description, primaryColor, secondaryColor, backgroundColor } = req.body;

    let banner = await Banner.findOne();

    if (!banner) {
      banner = new Banner({
        title,
        description,
        primaryColor,
        secondaryColor,
        backgroundColor,
      });
    } else {
      banner.title = title || banner.title;
      banner.description = description || banner.description;
      banner.primaryColor = primaryColor || banner.primaryColor;
      banner.secondaryColor = secondaryColor || banner.secondaryColor;
      banner.backgroundColor = backgroundColor || banner.backgroundColor;
    }

    const champion = await Champion.findOne().sort({ _id: 1 });
    if (champion) banner.image = champion.image;

    const updated = await banner.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

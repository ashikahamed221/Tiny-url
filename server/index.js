import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(express.json());

const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many URL creation requests. Please try again later.",
  },
});

app.use("/api/shorturl", createUrlLimiter);
app.use(cors());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

// URL model
const urlSchema = new mongoose.Schema(
  {
    Originalurl: {
      type: String,
      required: true,
      trim: true,
    },
    ShortId: {
      type: String,
      required: true,
      unique: true,
    },
    Clickcount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model("Url", urlSchema);

// Health route must come before the dynamic redirect route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Tiny URL API is running",
  });
});

// Create a short URL
app.post("/api/shorturl", async (req, res) => {
  try {
    const { Originalurl } = req.body;

    // Validate input
    if (
      typeof Originalurl !== "string" ||
      !Originalurl.trim()
    ) {
      return res.status(400).json({
        message: "Please provide a valid URL",
      });
    }

    const trimmedUrl = Originalurl.trim();

    // Validate URL format and protocol
    let parsedUrl;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      return res.status(400).json({
        message: "Invalid URL format",
      });
    }

    if (
      !["http:", "https:"].includes(parsedUrl.protocol)
    ) {
      return res.status(400).json({
        message: "Only HTTP and HTTPS URLs are allowed",
      });
    }

    // Generate a unique short ID
    let shortId;
    let savedUrl;

    for (let attempt = 0; attempt < 3; attempt++) {
      shortId = nanoid(6);

      try {
        savedUrl = await Url.create({
          Originalurl: parsedUrl.toString(),
          ShortId: shortId,
        });

        break;
      } catch (error) {
        // Retry only if the short ID already exists
        if (error.code !== 11000) {
          throw error;
        }
      }
    }

    if (!savedUrl) {
      return res.status(500).json({
        message: "Could not generate a unique short ID",
      });
    }

    return res.status(201).json({
      Shorturl: `http://localhost:4000/${savedUrl.ShortId}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);

    return res.status(500).json({
      message: "Failed to create short URL",
    });
  }
});

// short urls



app.get("/api/shorturls", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const skip = (page - 1) * limit;

    const [urls, totalUrls] = await Promise.all([
      Url.find()
        .select("Originalurl ShortId Clickcount createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      Url.countDocuments(),
    ]);

    return res.status(200).json({
      urls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUrls / limit),
        totalUrls,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);

    return res.status(500).json({
      message: "Failed to fetch URLs",
    });
  }
});


//delete URL


app.delete("/api/shorturl/:ShortId", async (req, res) => {
  try {
    const { ShortId } = req.params;

    const deletedUrl = await Url.findOneAndDelete({ ShortId });

    if (!deletedUrl) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    return res.status(200).json({
      message: "Short URL deleted successfully",
      deletedShortId: deletedUrl.ShortId,
    });
  } catch (error) {
    console.error("Error deleting short URL:", error);

    return res.status(500).json({
      message: "Failed to delete short URL",
    });
  }
});



// Redirect and atomically increment click count
app.get("/:ShortId", async (req, res) => {
  try {
    const found = await Url.findOneAndUpdate(
      { ShortId: req.params.ShortId },
      { $inc: { Clickcount: 1 } },
      { new: true }
    );

    if (!found) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(found.Originalurl);
  } catch (error) {
    console.error("Error redirecting URL:", error);

    return res.status(500).send("Internal server error");
  }
});

// stat card


app.get("/api/shorturls/stats", async (req, res) => {
  try {
    const [totalUrls, result] = await Promise.all([
      Url.countDocuments(),
      Url.aggregate([
        {
          $group: {
            _id: null,
            totalClicks: { $sum: "$Clickcount" },
            averageClicks: { $avg: "$Clickcount" },
          },
        },
      ]),
    ]);

    const stats = result[0] || {
      totalClicks: 0,
      averageClicks: 0,
    };

    return res.status(200).json({
      totalUrls,
      totalClicks: stats.totalClicks,
      averageClicks: Number(
        stats.averageClicks.toFixed(1)
      ),
    });
  } catch (error) {
    console.error("Error fetching URL statistics:", error);

    return res.status(500).json({
      message: "Failed to fetch URL statistics",
    });
  }
});


// get stats

app.get("/api/shorturl/:ShortId/stats", async (req, res) => {
  try {
    const { ShortId } = req.params;

    const url = await Url.findOne({ ShortId }).select(
      "Originalurl ShortId Clickcount createdAt"
    );

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    return res.status(200).json({
      Originalurl: url.Originalurl,
      ShortId: url.ShortId,
      Clickcount: url.Clickcount,
      CreatedAt: url.createdAt,
    });
  } catch (error) {
    console.error("Error fetching URL statistics:", error);

    return res.status(500).json({
      message: "Failed to fetch URL statistics",
    });
  }
});





// Start server only after MongoDB connects

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 4000;

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

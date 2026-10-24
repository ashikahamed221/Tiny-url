import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = new Set(
  ["http://localhost:5173", process.env.CLIENT_URL?.trim()]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/+$/, "")),
);

const corsOptions = {
  origin(origin, callback) {
    callback(null, Boolean(origin && allowedOrigins.has(origin)));
  },
};

app.use(cors(corsOptions));
app.options(/.*/, (req, res) => res.sendStatus(204));

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

const MONGODB_URI = process.env.MONGODB_URI;

let cached = globalThis.__tinyUrlMongoose;

if (!cached) {
  cached = globalThis.__tinyUrlMongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        cached.conn = mongoose.connection;
        cached.promise = null;
        return cached.conn;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  return cached.promise;
}

function getBackendUrl() {
  const configuredUrl = process.env.BACKEND_URL?.trim();

  if (configuredUrl) {
    const parsedUrl = new URL(configuredUrl);

    if (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
      throw new Error("BACKEND_URL must use HTTPS in production");
    }

    return parsedUrl.origin;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:4000";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  throw new Error("BACKEND_URL is required in production");
}

function logDatabaseError(error) {
  const message = String(error?.message || "Unknown database error")
    .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "[redacted MongoDB URI]")
    .replace(MONGODB_URI || "\0", "[redacted MongoDB URI]");

  console.error("MongoDB connection failed", {
    name: error?.name || "Error",
    code: error?.code,
    message,
  });
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
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logDatabaseError(error);
    res.status(503).json({
      message: "Database unavailable",
    });
  }
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

    const backendUrl = getBackendUrl();

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
      Shorturl: `${backendUrl}/${savedUrl.ShortId}`,
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

// Keep the catch-all redirect after every API route.
app.get("/:ShortId", async (req, res) => {
  try {
    const found = await Url.findOneAndUpdate(
      { ShortId: req.params.ShortId },
      { $inc: { Clickcount: 1 } },
      { new: true },
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

export default app;

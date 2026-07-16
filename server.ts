import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for weather proxy
  app.get("/api/weather", async (req, res) => {
    try {
      const city = req.query.city as string;
      const units = (req.query.units as string) || "metric";

      console.log(`[Weather API] Request received for city: "${city}", units: "${units}"`);

      if (!city) {
        return res.status(400).json({ error: "City parameter is required." });
      }

      let apiKey = process.env.OPENWEATHER_API_KEY || "712ffaa5e4cbf434203f2402e54f6b7d";
      if (apiKey) {
        apiKey = apiKey.trim().replace(/^["']|["']$/g, "").trim();
      }

      if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "") {
        console.warn("[Weather API] API key is missing or empty.");
        return res.status(401).json({
          error: "API_KEY_MISSING",
          message: "OpenWeatherMap API key is not configured. Please set the OPENWEATHER_API_KEY environment variable in your secrets or .env file."
        });
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=${units}`;

      console.log(`[Weather API] Fetching from OpenWeatherMap...`);
      const response = await fetch(url);
      const data = await response.json();

      console.log(`[Weather API] OpenWeatherMap response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          console.error("[Weather API] OpenWeatherMap returned 401 Unauthorized.");
          return res.status(401).json({
            error: "API_KEY_INVALID",
            message: "The configured OpenWeatherMap API key is invalid or not yet activated. Please check your key or try again in a few minutes."
          });
        }
        return res.status(response.status).json({
          error: "API_ERROR",
          message: data.message || "City not found — check the spelling and try again"
        });
      }

      console.log(`[Weather API] Successfully fetched weather for ${data.name}`);
      return res.json(data);
    } catch (error: any) {
      console.error("Error in /api/weather:", error);
      return res.status(500).json({
        error: "SERVER_ERROR",
        message: error.message || "Internal server error."
      });
    }
  });

  // Simple endpoint to help debug environment issues safely
  app.get("/api/debug-weather", (req, res) => {
    try {
      const rawKey = process.env.OPENWEATHER_API_KEY || "";
      const cleanedKey = rawKey.trim().replace(/^["']|["']$/g, "").trim();
      
      res.json({
        node_version: process.version,
        env_node_env: process.env.NODE_ENV,
        has_raw_key: rawKey.length > 0,
        raw_key_length: rawKey.length,
        has_cleaned_key: cleanedKey.length > 0,
        cleaned_key_length: cleanedKey.length,
        key_start: cleanedKey ? cleanedKey.substring(0, 4) + "..." : "none",
        key_end: cleanedKey ? "..." + cleanedKey.substring(cleanedKey.length - 4) : "none",
        contains_quotes: rawKey.startsWith('"') || rawKey.startsWith("'") || rawKey.endsWith('"') || rawKey.endsWith("'")
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

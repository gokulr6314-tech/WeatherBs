var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config({ override: true });
async function startServer() {
  const app = (0, import_express.default)();
  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(import_express.default.json());
  app.get("/api/weather", async (req, res) => {
    try {
      const city = req.query.city;
      const units = req.query.units || "metric";
      console.log(
        `[Weather API] Request received for city: "${city}", units: "${units}"`
      );
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
      console.log(
        `[Weather API] OpenWeatherMap response status: ${response.status}`
      );
      if (!response.ok) {
        if (response.status === 401) {
          console.error(
            "[Weather API] OpenWeatherMap returned 401 Unauthorized."
          );
          return res.status(401).json({
            error: "API_KEY_INVALID",
            message: "The configured OpenWeatherMap API key is invalid or not yet activated. Please check your key or try again in a few minutes."
          });
        }
        return res.status(response.status).json({
          error: "API_ERROR",
          message: data.message || "City not found \u2014 check the spelling and try again"
        });
      }
      console.log(
        `[Weather API] Successfully fetched weather for ${data.name}`
      );
      return res.json(data);
    } catch (error) {
      console.error("Error in /api/weather:", error);
      return res.status(500).json({
        error: "SERVER_ERROR",
        message: error.message || "Internal server error."
      });
    }
  });
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
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  if (NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

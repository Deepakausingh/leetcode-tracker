const express = require("express");
const http = require("http");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config(); // ✅ load env variables

const { fetchLeetcodeData } = require("./services/leetcodeService");
const getCalendar = require("./services/leetcodeCalendarService");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

// ✅ fetch username from env
const USERNAME = process.env.LEETCODE_USERNAME || "defaultUsername"; 

let latestData = null; // ✅ start as null

/* ================= LOAD DATA IMMEDIATELY ================= */
async function loadInitialData() {
  try {
    console.log(`Fetching initial LeetCode stats for ${USERNAME}...`);
    latestData = await fetchLeetcodeData(USERNAME);
    console.log("✅ Initial stats loaded");
  } catch (err) {
    console.log("Initial fetch failed:", err);
  }
}

loadInitialData();

/* ================= API ================= */
app.get("/progress", (req, res) => {
  if (!latestData) {
    return res.status(503).json({
      message: "Stats loading..."
    });
  }

  res.json(latestData);
});

/* ================= CALENDAR ================= */
app.get("/calendar/:username", async (req, res) => {
  try {
    const data = await getCalendar(req.params.username);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching calendar");
  }
});

/* ================= REALTIME UPDATE ================= */
cron.schedule("*/5 * * * *", async () => {
  console.log(`Updating LeetCode stats for ${USERNAME}...`);
  try {
    latestData = await fetchLeetcodeData(USERNAME);
    io.emit("progressUpdate", latestData);
    console.log("✅ Stats updated");
  } catch (err) {
    console.log("Cron update failed:", err);
  }
});

io.on("connection", () => {
  console.log("User connected");
});

// ✅ use PORT from env with fallback
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

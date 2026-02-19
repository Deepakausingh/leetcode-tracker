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

/* ================= API: PROGRESS ================= */
app.get("/progress", async (req, res) => {
  try {
    // Fetch fresh data on every request
    const data = await fetchLeetcodeData(USERNAME);
    latestData = data; // Update cached data
    res.json(data);
  } catch (err) {
    console.log("Error fetching progress:", err);
    res.status(500).json({ message: "Error fetching progress" });
  }
});

/* ================= API: CALENDAR ================= */
app.get("/calendar/:username", async (req, res) => {
  try {
    const data = await getCalendar(req.params.username);
    res.json(data);
  } catch (err) {
    console.log("Error fetching calendar:", err);
    res.status(500).send("Error fetching calendar");
  }
});

/* ================= REALTIME UPDATE ================= */
cron.schedule("*/5 * * * *", async () => {
  console.log(`Updating LeetCode stats for ${USERNAME}...`);
  try {
    latestData = await fetchLeetcodeData(USERNAME);
    io.emit("progressUpdate", latestData); // Emit to all connected clients
    console.log("✅ Stats updated via cron");
  } catch (err) {
    console.log("Cron update failed:", err);
  }
});

/* ================= SOCKET.IO CONNECTION ================= */
io.on("connection", (socket) => {
  console.log("User connected");

  // Send latest data immediately upon connection
  if (latestData) {
    socket.emit("progressUpdate", latestData);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

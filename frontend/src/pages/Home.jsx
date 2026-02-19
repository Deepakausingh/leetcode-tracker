import React, { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import CalendarGrid from "../components/CalendarGrid";
import logo from "../assets/leetcode.png";


export default function Home() {

  const USERNAME = "deepaksingh804142";

  const [calendarData, setCalendarData] = useState({});
  const [statsData, setStatsData] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // ===== LOAD CALENDAR =====
        const calRes = await fetch(
          `http://localhost:5000/calendar/${USERNAME}`
        );
        const cal = await calRes.json();
        setCalendarData(cal);
        setLoadingCalendar(false);

        // ===== LOAD STATS =====
        const statsRes = await fetch("http://localhost:5000/progress");
        const stats = await statsRes.json();
        console.log("STATS RECEIVED:", stats);
        setStatsData(stats);

      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-container max-w-[1600px] w-full mx-auto p-6 md:p-10 text-gray-200 relative">

      {/* ================= HEADER ================= */}
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-20 h-20 flex items-center justify-center shadow-lg bg-transparent">
              <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight">
              Leetcode Activity Tracker
            </h2>
          </div>
          <p className="text-gray-400 font-medium flex items-center gap-2">
            Check out my profile stats on LeetCode!
            <a
              href={`https://leetcode.com/deepaksingh804142/`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-2 py-1 text-xs font-semibold text-white border border-[#333] bg-[#0d1117] hover:bg-green-600 transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.4) hover:z-20 cursor-pointer"
            >
              View Profile
            </a>
          </p>
        </div>
      </header>

      {/* ================= LEGEND ================= */}
      <div className="flex items-center gap-6 mb-4 text-sm shrink-0">
        <span className="text-gray-500 font-medium">Activity Level:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#161b22] border border-white/10"></div>
          <div className="w-4 h-4 bg-[#0e4429] border border-white/10"></div>
          <div className="w-4 h-4 bg-[#006d32] border border-white/10"></div>
          <div className="w-4 h-4 bg-[#26a641] border border-white/10"></div>
          <div className="w-4 h-4 bg-[#39d353] border border-white/10"></div>
        </div>
      </div>

      {/* ================= CALENDAR ================= */}
      <div
        id="calendarWrapper"
        className="flex gap-16 overflow-x-auto pb-0 pt-4 items-start scroll-smooth flex-grow"
      >
        {loadingCalendar ? (
          <div className="text-gray-400">Loading calendar...</div>
        ) : (
          <CalendarGrid calendar={calendarData} />
        )}
      </div>

      {/* ================= STATS CARD FLOATING ================= */}
      {statsData && (
        <div className="fixed top-8 right-8 z-50">
          <StatsCard data={statsData} />
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState } from "react";
import questionsData from "../assets/data/data.json";

const year = new Date().getFullYear();

const colors = [
  "bg-[#161b22]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]"
];

const daysLabel = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarGrid({ calendar = {} }) {

  const [panelData, setPanelData] = useState(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [locked, setLocked] = useState(false);

  const panelRef = useRef();

  /* ---------- FORMAT DATE ---------- */
  const formatKey = (y, m, d) =>
    `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  /* ---------- convert timestamps ---------- */
  const submissionMap = {};

  Object.entries(calendar).forEach(([ts, count]) => {
    const date = new Date(Number(ts) * 1000);

    const key = formatKey(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );

    submissionMap[key] = count;
  });

  /* ---------- level ---------- */
  const getLevel = (count) => {
    if (!count) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  /* ---------- SMART AUTO POSITION PANEL ---------- */
  const positionPanel = (rect) => {

    const margin = 12;
    const panelW = 320;
    const panelH = 260;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.top;
    let left = rect.right + margin; // default right

    /* ----- horizontal flip ----- */
    if (left + panelW > vw) {
      left = rect.left - panelW - margin;
    }

    if (left < margin) {
      left = margin;
    }

    /* ----- vertical adjustment ----- */
    if (top + panelH > vh) {
      top = rect.bottom - panelH;
    }

    if (top < margin) {
      top = margin;
    }

    /* ----- final clamp ----- */
    top = Math.min(top, vh - panelH - margin);
    left = Math.min(left, vw - panelW - margin);

    setPanelPos({ top, left });
  };

  /* ---------- create month ---------- */
  const renderMonth = (monthIndex) => {

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const cells = [];

    // empty top cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={"empty-top"+i} className="w-[50px] h-[50px]" />);
    }

    // days
    for (let d = 1; d <= totalDays; d++) {

      const key = formatKey(year, monthIndex + 1, d);
      const count = submissionMap[key] || 0;
      const level = getLevel(count);
      const solvedQuestions = questionsData[key] || [];

      const showPanel = (e) => {
        if (locked) return;

        const rect = e.currentTarget.getBoundingClientRect();
        positionPanel(rect);

        setPanelData({
          date: new Date(year, monthIndex, d).toDateString(),
          count,
          questions: solvedQuestions
        });
      };

      const leavePanel = () => {
        if (!locked) setPanelData(null);
      };

      const lockPanel = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        positionPanel(rect);

        setLocked(true);
        setPanelData({
          date: new Date(year, monthIndex, d).toDateString(),
          count,
          questions: solvedQuestions
        });
      };

      cells.push(
        <div
          key={d}
          onMouseEnter={showPanel}
          onMouseLeave={leavePanel}
          onClick={lockPanel}
          className={`
            w-[50px] h-[50px]
            ${colors[level]}
            flex items-center justify-center
            text-[10px] font-bold text-white/10
            hover:text-white hover:scale-110
            hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]
            cursor-pointer border border-black/40
            transition-all duration-150
          `}
        >
          {d}
        </div>
      );
    }

    // bottom padding
    const used = firstDay + totalDays;
    const padding = (7 - (used % 7)) % 7;

    for (let i = 0; i < padding; i++) {
      cells.push(<div key={"empty-bottom"+i} className="w-[50px] h-[50px]" />);
    }

    return (
      <div key={monthIndex} className="flex flex-col gap-4 min-w-max">

        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] opacity-40 border-b border-white/10 pb-2 mb-1 ml-[58px]">
          {new Date(year, monthIndex).toLocaleString("default",{month:"long"})}
        </h3>

        <div className="flex gap-4 items-start">

          <div className="grid grid-rows-7 gap-2 h-[398px] text-[8px] text-gray-600 font-bold items-center pr-2 uppercase">
            {daysLabel.map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-rows-7 grid-flow-col gap-2">
            {cells}
          </div>

        </div>
      </div>
    );
  };

  /* ---------- render ---------- */
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => renderMonth(i))}

      {panelData && (
        <div
          ref={panelRef}
          style={{ top: panelPos.top, left: panelPos.left }}
          className="fixed z-50 w-[320px] bg-[#0b0f14]
                     border border-gray-700 p-5 shadow-2xl
                     transition-all duration-200"
        >
          <button
            className="absolute top-2 right-3 text-red-400"
            onClick={()=>{
              setLocked(false);
              setPanelData(null);
            }}
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-2">
            {panelData.date}
          </h3>

          <p className="text-sm text-green-400 mb-3">
            Submissions: {panelData.count}
          </p>

          <div className="space-y-2 max-h-[180px] overflow-y-auto">

            {panelData.questions.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No solved questions recorded.
              </p>
            ) : (
              panelData.questions.map((q,i)=>(
                <a
                  key={i}
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-cyan-400 hover:underline"
                >
                  {q.name}
                </a>
              ))
            )}

          </div>
        </div>
      )}
    </>
  );
}
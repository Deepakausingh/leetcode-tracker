import React from "react";

const year = new Date().getFullYear();

const colors = [
  "bg-[#161b22]", // zero
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]"
];

const daysLabel = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarGrid({ calendar = {} }) {

  // ---------- convert leetcode timestamps ----------
  const submissionMap = {};

  Object.entries(calendar).forEach(([ts, count]) => {
    const d = new Date(Number(ts) * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    submissionMap[key] = count;
  });

  // ---------- level calculation ----------
  const getLevel = (count) => {
    if (!count) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  // ---------- create month ----------
  const renderMonth = (monthIndex) => {

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const cells = [];

    // top padding
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={"empty-top"+i} className="w-[50px] h-[50px]" />);
    }

    // real days
    for (let d = 1; d <= totalDays; d++) {

      const key = `${year}-${monthIndex}-${d}`;
      const count = submissionMap[key] || 0;
      const level = getLevel(count);

      cells.push(
        <div
          key={d}
          className={`
            day-cell cell-transition
            w-[50px] h-[50px]
            ${colors[level]}
            flex items-center justify-center
            text-[10px] font-bold text-white/10
            hover:text-white hover:scale-110
            hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]
            hover:z-20 cursor-pointer
            border border-black/40

          `}
          title={`${new Date(year, monthIndex, d).toDateString()}
Submission: ${count}`}
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
      <div
        key={monthIndex}
        className="flex flex-col gap-4 min-w-max"
      >
        {/* MONTH TITLE */}
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] opacity-40 border-b border-white/10 pb-2 mb-1 ml-[58px]">
          {new Date(year, monthIndex).toLocaleString("default", {
            month: "long"
          })}
        </h3>

        <div className="flex gap-4 items-start">

          {/* DAY LABELS */}
          <div className="grid grid-rows-7 gap-2 h-[398px] text-[8px] text-gray-600 font-bold items-center pr-2 uppercase">
            {daysLabel.map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-rows-7 grid-flow-col gap-2 ">
            {cells}
          </div>

        </div>
      </div>
    );
  };

  // ---------- render full year ----------
  return (
    <>
      {Array.from({ length: 12 }, (_, i) =>
        renderMonth(i)
      )}
    </>
  );
}

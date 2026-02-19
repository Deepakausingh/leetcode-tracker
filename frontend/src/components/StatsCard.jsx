import React, { useEffect, useState } from "react";

export default function StatsCard({ data }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Stats calculation
  const easy = data?.easy || 0;
  const medium = data?.medium || 0;
  const hard = data?.hard || 0;
  const totalSolved = data?.total || (easy + medium + hard);
  const totalQuestions = data?.totalQuestions || 3846;
  const percent = (totalSolved / totalQuestions) * 100;

  // SVG Configuration
  const radius = 36;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const center = 40;

  // Reset animation whenever data changes
  useEffect(() => {
    if (!data) return;

    setIsLoaded(false); // reset first
    const timer = setTimeout(() => setIsLoaded(true), 50); // trigger animation
    return () => clearTimeout(timer);
  }, [data, easy, medium, hard, totalSolved]); // watch stats values too

  if (!data) {
    return (
      <div className="flex items-center justify-center bg-[#1f1f1f] p-6 w-full max-w-lg border border-[#333] h-28 animate-pulse">
        <div className="text-gray-500 text-xs uppercase tracking-widest font-bold">
          Loading Stats..
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-[#0d1117] p-5 shadow-2xl w-full max-w-2xl border border-[#333] group transition-all duration-500 hover:border-[#444]">
      {/* LEFT — Animated Circular Progress */}
      <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-full h-full rotate-[-90deg]">
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#2a2a2a"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: isLoaded
                ? circumference - (percent / 100) * circumference
                : circumference,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            strokeLinecap="butt"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-xl font-black leading-none">{totalSolved}</span>
          <div className="h-[1px] w-8 bg-gray-700 my-1"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">{totalQuestions}</span>
        </div>
      </div>

      {/* RIGHT — Horizontal Stats with Micro-Progress indicators */}
      <div className="flex-1 flex justify-around items-center ml-4">
        {/* Easy Section */}
        <div className="flex flex-col items-start px-4">
          <p className="text-[#20bbbb] text-[10px] uppercase tracking-widest font-black mb-1">Easy</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl text-white font-mono font-bold leading-none">{easy}</span>
            <span className="text-[10px] text-gray-600 font-mono">/792</span>
          </div>
          <div className="w-full h-[2px] bg-gray-800 mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#20bbbb] transition-all duration-1000 delay-300" 
              style={{ width: isLoaded ? `${(easy/792)*100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Medium Section */}
        <div className="flex flex-col items-start px-4 border-l border-[#2a2a2a]">
          <p className="text-[#ffb800] text-[10px] uppercase tracking-widest font-black mb-1">Medium</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl text-white font-mono font-bold leading-none">{medium}</span>
            <span className="text-[10px] text-gray-600 font-mono">/1724</span>
          </div>
          <div className="w-full h-[2px] bg-gray-800 mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#ffb800] transition-all duration-1000 delay-500" 
              style={{ width: isLoaded ? `${(medium/1724)*100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Hard Section */}
        <div className="flex flex-col items-start px-4 border-l border-[#2a2a2a]">
          <p className="text-[#ef4444] text-[10px] uppercase tracking-widest font-black mb-1">Hard</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl text-white font-mono font-bold leading-none">{hard}</span>
            <span className="text-[10px] text-gray-600 font-mono">/730</span>
          </div>
          <div className="w-full h-[2px] bg-gray-800 mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#ef4444] transition-all duration-1000 delay-700" 
              style={{ width: isLoaded ? `${(hard/730)*100}%` : '0%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

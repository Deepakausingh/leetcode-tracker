export default function StreakBadge({ calendar }) {

  const values = Object.values(calendar);
  let streak = 0;

  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] > 0) streak++;
    else break;
  }

  return (
    <div className="mt-6 bg-[#161b22] p-4 rounded-xl w-fit">
      🔥 Current Streak:
      <span className="text-green-400 font-bold ml-2">
        {streak} days
      </span>
    </div>
  );
}

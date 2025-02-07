import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  date?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, description, icon, date }) => {
  return (
    <div className="font-inconsolata group h-52 w-72 [perspective:1000px]">
      <div className="relative h-full w-full rounded-xl shadow-xl border border-transparent 
          [background:linear-gradient(theme(colors.slate.900),theme(colors.slate.900))_padding-box,
          linear-gradient(45deg,theme(colors.slate.800),theme(colors.slate.600/.8),theme(colors.slate.800))_border-box]
          transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* Front Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full w-full 
            rounded-xl bg-gray-900/30 backdrop-blur-xl border border-gray-900/50 p-6 rounded-lg shadow-lg  px-6 text-center [backface-visibility:hidden]">
          <div className="text-4xl">{icon}</div>
          <h2 className="text-xl font-bold mt-2">{label}</h2>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>

        {/* Back Face */}
        <div className="font-inconsolata absolute inset-0 flex flex-col items-center justify-center h-full w-full 
            rounded-xl bg-gray-900/80 backdrop-blur-xl border border-gray-900/50 p-6 rounded-lg shadow-lg text-white px-6 text-center 
            [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h2 className="text-3xl font-bold">{value}</h2>
          {date && <p className="text-sm text-gray-400">on {date}</p>}
        </div>

      </div>
    </div>
  );
};

export default StatCard;

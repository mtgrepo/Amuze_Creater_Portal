
export default function Stat({ 
  icon, 
  value, 
  label 
}: { 
  icon: React.ReactNode; 
  value: string | number; 
  label: string 
}) {
    return (
    <div className="flex items-center gap-3 px-2 first:pl-0 group/stat">
      {/* Icon */}
      <div className="p-2 rounded-xl bg-white/5 group-hover/stat:bg-white/10 transition-colors">
        {icon}
      </div>
      
      <div className="flex flex-col items-start">
        {/* Data */}
        <span className="text-sm  font-black text-white leading-none">
          {value}
        </span>
        {/* Label */}
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}

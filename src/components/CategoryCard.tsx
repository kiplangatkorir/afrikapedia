interface CategoryCardProps {
  icon: string;
  name: string;
  count: string;
  color?: string;
  href?: string;
}

const colorMap: Record<string, string> = {
  red: "border-t-kente-red hover:bg-red-50",
  gold: "border-t-kente-gold hover:bg-amber-50",
  green: "border-t-kente-green hover:bg-green-50",
  teal: "border-t-accent-teal hover:bg-teal-50",
  clay: "border-t-clay hover:bg-orange-50",
};

export default function CategoryCard({
  icon,
  name,
  count,
  color = "red",
  href = "#",
}: CategoryCardProps) {
  return (
    <a
      href={href}
      className={`block bg-white border border-[#e8dfc8] border-t-4 p-3 md:p-4 lg:p-5 rounded-lg md:rounded cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group ${colorMap[color] || "border-t-kente-red"}`}
    >
      <div className="text-2xl md:text-3xl mb-1.5 md:mb-2.5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="font-display text-ink font-bold text-xs md:text-[15px] mb-0.5 md:mb-1 leading-tight group-hover:text-kente-gold transition-colors duration-300">
        {name}
      </div>
      <div className="text-muted text-[10px] md:text-xs group-hover:text-ink transition-colors duration-300">
        {count} articles
      </div>
    </a>
  );
}

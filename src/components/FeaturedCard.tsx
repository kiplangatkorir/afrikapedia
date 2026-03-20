import Link from "next/link";

interface FeaturedCardProps {
  title: string;
  excerpt: string;
  tag: string;
  tagColor?: string;
  image?: string;
  icon?: string;
  readMore?: string;
  size?: "large" | "small";
  href?: string;
}

export default function FeaturedCard({
  title,
  excerpt,
  tag,
  tagColor = "text-kente-red",
  icon,
  readMore = "Read →",
  size = "large",
  href = "#",
}: FeaturedCardProps) {
  return (
    <div className="group bg-white border border-[#e8dfc8] rounded-lg md:rounded overflow-hidden shadow-md md:shadow-[4px_4px_0_#F5A623] hover:shadow-xl md:hover:shadow-[8px_8px_0_#F5A623] hover:-translate-y-1 md:hover:-translate-x-1 md:hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {size === "large" && (
        <div className="w-full h-32 md:h-40 lg:h-[220px] bg-gradient-to-br from-kente-black to-clay flex items-center justify-center text-4xl md:text-6xl lg:text-8xl group-hover:scale-105 transition-transform duration-500">
          {icon || "🏛️"}
        </div>
      )}
      <div className="p-4 md:p-5 lg:p-6">
        <div
          className={`text-[9px] md:text-[10px] tracking-widest uppercase ${tagColor} font-medium mb-1.5 md:mb-2 group-hover:translate-x-1 transition-transform duration-300`}
        >
          {tag}
        </div>
        <h3 className="font-display text-base md:text-lg lg:text-xl font-bold text-ink mb-2 leading-tight group-hover:text-kente-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed font-serif line-clamp-2 md:line-clamp-none">
          {excerpt}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 mt-3 md:mt-4 text-xs tracking-widest uppercase text-kente-green font-medium no-underline border-b-2 border-kente-green hover:text-kente-gold hover:border-kente-gold transition-all duration-300 group-hover:gap-3"
        >
          {readMore}
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

interface ArticleRowProps {
  number: string;
  title: string;
  meta: string;
  tag: string;
  tagClass: string;
}

export default function ArticleRow({
  number,
  title,
  meta,
  tag,
  tagClass,
}: ArticleRowProps) {
  return (
    <div className="grid grid-cols-[40px_1fr] md:grid-cols-[50px_1fr_auto] gap-2 md:gap-4 lg:gap-5 items-start md:items-center px-3 md:px-5 lg:px-6 py-3 md:py-4 bg-white border-b border-[#f0e8d8] hover:bg-[#fdf8ef] transition-colors cursor-pointer active:bg-[#fdf8ef]">
      <div className="font-display text-kente-gold text-lg md:text-[22px] lg:text-[28px] font-black leading-none">
        {number}
      </div>
      <div>
        <div className="font-display text-ink font-bold text-sm md:text-base mb-0.5 md:mb-1 leading-tight">
          {title}
        </div>
        <div className="text-muted text-[10px] md:text-xs hidden md:block">
          {meta}
        </div>
      </div>
      <span
        className={`text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium whitespace-nowrap ${tagClass} ml-auto md:ml-0`}
      >
        {tag}
      </span>
    </div>
  );
}

interface LanguageCardProps {
  name: string;
  nativeName: string;
}

export default function LanguageCard({ name, nativeName }: LanguageCardProps) {
  return (
    <div className="bg-white border border-[#e8dfc8] p-2.5 md:p-3.5 rounded-lg text-center cursor-pointer hover:bg-kente-black hover:border-kente-gold transition-colors group active:scale-95">
      <div className="font-medium text-ink text-xs md:text-sm group-hover:text-kente-gold transition-colors">
        {name}
      </div>
      <div className="text-muted text-[10px] md:text-xs mt-0.5 md:mt-1 group-hover:text-gray-500 transition-colors">
        {nativeName}
      </div>
    </div>
  );
}

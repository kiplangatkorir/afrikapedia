export default function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--bg2] mt-auto">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-9">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--text3] mb-4">
            Afrikapedia
          </div>
          <div className="flex flex-col gap-2">
            <FooterLink href="#">About the Project</FooterLink>
            <FooterLink href="#">Editorial Policy</FooterLink>
            <FooterLink href="#">Cite this Page</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </div>
        </div>
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--text3] mb-4">
            Contribute
          </div>
          <div className="flex flex-col gap-2">
            <FooterLink href="#">Create an Article</FooterLink>
            <FooterLink href="#">Translate Content</FooterLink>
            <FooterLink href="#">Upload Media</FooterLink>
            <FooterLink href="#">Report an Error</FooterLink>
          </div>
        </div>
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--text3] mb-4">
            Explore
          </div>
          <div className="flex flex-col gap-2">
            <FooterLink href="#">Random Article</FooterLink>
            <FooterLink href="#">Featured Articles</FooterLink>
            <FooterLink href="#">Kingdoms Timeline</FooterLink>
            <FooterLink href="#">Language Index</FooterLink>
          </div>
        </div>
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--text3] mb-4">
            Partner With Us
          </div>
          <p className="font-serif text-[13px] text-[--text2] leading-[1.7] mb-4 italic">
            Afrikapedia is an open project. When the MsingiAI model launches, it
            will power semantic search and article summarisation in African
            languages.
          </p>
          <a
            href="#"
            className="font-sans text-[11px] text-[--gold] no-underline border-b border-[--gold2] pb-[2px] tracking-[1px] uppercase font-bold"
          >
            Learn more →
          </a>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-9 py-4 border-t border-[--border] flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-[13px] italic text-[--text3]">
          "Until the lion learns to write, every story will glorify the hunter."
        </span>
        <span className="font-sans text-[11px] text-[--text3] tracking-[0.3px]">
          Afrikapedia · Free African Encyclopaedia · CC BY-SA 4.0
        </span>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-serif text-[13px] text-[--text2] no-underline hover:text-[--gold] transition-colors"
    >
      {children}
    </a>
  );
}

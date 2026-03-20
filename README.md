# Afrikapedia

The Free African Encyclopedia — celebrating African history, culture, science, and innovation.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom Kente color palette
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: Anthropic Claude API for the Oracle feature
- **Fonts**: Playfair Display, DM Sans, Noto Serif

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
afrikapedia/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Homepage
│   │   ├── layout.tsx    # Root layout
│   │   ├── globals.css   # Global styles + Tailwind
│   │   ├── articles/[slug]/  # Dynamic article pages
│   │   └── api/oracle/   # AI Oracle API endpoint
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── OracleChat.tsx
│   │   ├── FeaturedCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ArticleRow.tsx
│   │   └── LanguageCard.tsx
│   ├── lib/              # Utilities
│   │   ├── supabase.ts   # Supabase client
│   │   └── anthropic.ts  # Claude AI client
│   └── types/            # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema + seed data
├── tailwind.config.ts    # Tailwind config with Kente colors
├── package.json
└── next.config.js
```

## Features

- **AI Oracle**: Ask questions about African history/culture, powered by Claude
- **Full-text Search**: Search articles using PostgreSQL
- **Article Versioning**: Track all edits with revision history
- **User Accounts**: Sign up to contribute articles
- **Categories**: Browse by topic (Ancient Civilizations, Music, Kingdoms, etc.)
- **Multi-language**: Support for 11 African languages
- **Responsive**: Works on mobile and desktop

## Design System

### Colors

| Name        | Hex     | Usage                      |
| ----------- | ------- | -------------------------- |
| kente-gold  | #F5A623 | Primary accent, highlights |
| kente-red   | #C0392B | Secondary accent           |
| kente-green | #1E6B3A | Success, nature content    |
| kente-black | #0D0D0D | Text, backgrounds          |
| sand        | #F2EBD9 | Page background            |
| clay        | #B5651D | Warm accent                |
| accent-teal | #0E7C6B | Links, interactive         |

### Typography

- **Display**: Playfair Display (headings)
- **Body**: DM Sans (UI, body text)
- **Serif**: Noto Serif (articles, quotes)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

_"Until the lion learns to write, every story will glorify the hunter."_ — African Proverb

-- Afrikapedia Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  contributions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages table
CREATE TABLE public.languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  article_count INTEGER DEFAULT 0
);

-- Articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  featured BOOLEAN DEFAULT false,
  language_code TEXT DEFAULT 'en',
  author_id UUID REFERENCES public.profiles(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article revisions for version control
CREATE TABLE public.article_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  change_summary TEXT,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search index (using pg_trgm for full-text search)
CREATE INDEX articles_title_search ON public.articles USING gin (title gin_trgm_ops);
CREATE INDEX articles_content_search ON public.articles USING gin (content gin_trgm_ops);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Articles are viewable by everyone" 
  ON public.articles FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert articles" 
  ON public.articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles" 
  ON public.articles FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can read revisions" 
  ON public.article_revisions FOR SELECT USING (true);

CREATE POLICY "Authors can insert revisions" 
  ON public.article_revisions FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Trigger to update article count on categories
CREATE OR REPLACE FUNCTION update_category_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.categories
  SET article_count = (
    SELECT COUNT(*) FROM public.articles WHERE category_id = NEW.category_id
  )
  WHERE id = NEW.category_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_article_insert
AFTER INSERT ON public.articles
FOR EACH ROW EXECUTE FUNCTION update_category_count();

-- Insert seed categories
INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Ancient Civilizations', 'ancient-civilizations', '🏺', 'History of ancient African civilizations'),
  ('Music & Arts', 'music-arts', '🎶', 'African music, art, and creative expressions'),
  ('Indigenous Science', 'indigenous-science', '🌿', 'Traditional African scientific knowledge'),
  ('Kingdoms & Empires', 'kingdoms-empires', '👑', 'African kingdoms and empires through history'),
  ('Geography & Land', 'geography-land', '🗺️', 'African geography, landscapes, and regions'),
  ('Medicine & Healing', 'medicine-healing', '🧬', 'Traditional African medicine and healing practices'),
  ('Languages & Scripts', 'languages-scripts', '✍️', 'African languages and writing systems'),
  ('Modern Innovation', 'modern-innovation', '💡', 'African contributions to modern innovation');

-- Insert seed languages
INSERT INTO public.languages (code, name, native_name) VALUES
  ('en', 'English', 'English'),
  ('sw', 'Swahili', 'Kiswahili'),
  ('yo', 'Yoruba', 'Èdè Yorùbá'),
  ('am', 'Amharic', 'አማርኛ'),
  ('ha', 'Hausa', 'Harshen Hausa'),
  ('zu', 'Zulu', 'isiZulu'),
  ('ig', 'Igbo', 'Asụsụ Igbo'),
  ('so', 'Somali', 'Af Soomaali'),
  ('sn', 'Shona', 'chiShona'),
  ('wo', 'Wolof', 'Wolof'),
  ('tw', 'Twi', 'Akan Twi');

-- Enable realtime for articles
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;

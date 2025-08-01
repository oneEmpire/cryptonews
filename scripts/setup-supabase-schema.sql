-- Run this in your Supabase SQL Editor
-- Create the news table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  time_ago VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_breaking BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_news_is_trending ON news(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_news_is_breaking ON news(is_breaking) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS idx_news_views ON news(views DESC);
CREATE INDEX IF NOT EXISTS idx_news_location ON news(location);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can read news" ON news
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update (for admin)
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

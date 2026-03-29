-- Run this once in your Vercel Postgres dashboard (Storage → Query)
CREATE TABLE IF NOT EXISTS ratings (
  id         SERIAL PRIMARY KEY,
  input      TEXT    NOT NULL,
  analogy    TEXT    NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

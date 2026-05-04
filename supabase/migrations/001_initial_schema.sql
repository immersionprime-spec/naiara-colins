CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_select_public" ON media FOR SELECT USING (true);
CREATE POLICY "media_insert_service" ON media
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "media_update_service" ON media
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "media_delete_service" ON media
  FOR DELETE USING (auth.role() = 'service_role');

CREATE TABLE content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text NOT NULL,
  value text NOT NULL,
  language text NOT NULL DEFAULT 'pt',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (key, language)
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_select_public" ON content FOR SELECT USING (true);
CREATE POLICY "content_insert_service" ON content
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "content_update_service" ON content
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  "order" integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_select_public" ON services
  FOR SELECT USING (active = true);
CREATE POLICY "services_all_service" ON services
  FOR ALL USING (auth.role() = 'service_role');

CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  photo_url text,
  text text NOT NULL,
  stars integer NOT NULL DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  visible boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_select_visible" ON testimonials
  FOR SELECT USING (visible = true);
CREATE POLICY "testimonials_all_service" ON testimonials
  FOR ALL USING (auth.role() = 'service_role');

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  cover_url text,
  body text,
  language text NOT NULL DEFAULT 'pt',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_published" ON posts
  FOR SELECT USING (published = true);
CREATE POLICY "posts_all_service" ON posts
  FOR ALL USING (auth.role() = 'service_role');

CREATE TABLE instagram_cache (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id text NOT NULL UNIQUE,
  media_url text NOT NULL,
  thumbnail_url text,
  caption text,
  visible boolean NOT NULL DEFAULT true,
  cached_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE instagram_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instagram_select_visible" ON instagram_cache
  FOR SELECT USING (visible = true);
CREATE POLICY "instagram_all_service" ON instagram_cache
  FOR ALL USING (auth.role() = 'service_role');

CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name text NOT NULL,
  service_id uuid REFERENCES services (id),
  date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_service_only" ON appointments
  FOR ALL USING (auth.role() = 'service_role');

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', false),
  ('blog-covers', 'blog-covers', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "media_upload_service" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'service_role');
CREATE POLICY "media_update_service_objects" ON storage.objects FOR UPDATE
USING (bucket_id = 'media' AND auth.role() = 'service_role');
CREATE POLICY "media_delete_service_objects" ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.role() = 'service_role');

CREATE POLICY "blog_covers_upload_service" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-covers' AND auth.role() = 'service_role');
CREATE POLICY "blog_covers_delete_service" ON storage.objects FOR DELETE
USING (bucket_id = 'blog-covers' AND auth.role() = 'service_role');

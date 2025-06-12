/*
  # Create images table for background removal history

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_url` (text, URL to original image in storage)
      - `processed_url` (text, URL to processed image in storage)
      - `created_at` (timestamptz, when the image was uploaded)

  2. Security
    - Enable RLS on `images` table
    - Add policy for users to read their own images
    - Add policy for users to insert their own images
    - Add policy for users to update their own images
    - Add policy for users to delete their own images

  3. Storage
    - Create storage buckets for originals and processed images
    - Set up RLS policies for storage buckets
*/

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_url text NOT NULL,
  processed_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images table
CREATE POLICY "Users can read own images"
  ON images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON images
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('originals', 'originals', false),
  ('processed', 'processed', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for originals bucket
CREATE POLICY "Users can upload original images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own original images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own original images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'originals' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for processed bucket
CREATE POLICY "Users can upload processed images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'processed' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own processed images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'processed' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own processed images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'processed' AND auth.uid()::text = (storage.foldername(name))[1]);
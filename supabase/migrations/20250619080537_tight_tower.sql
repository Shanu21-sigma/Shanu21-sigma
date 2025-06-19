/*
  # Create Storage Buckets for Image Processing

  1. Storage Buckets
    - `originals` - For storing original uploaded images
    - `processed` - For storing processed/edited images
  
  2. Security
    - Enable RLS on storage.objects
    - Add policies for authenticated users to manage their own files
    - Set buckets to public for easy access to processed images

  3. Configuration
    - Both buckets configured with public access
    - File size limits and allowed file types
*/

-- Create the originals bucket for storing original uploaded images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'originals',
  'originals',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create the processed bucket for storing processed images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'processed',
  'processed',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to upload to originals bucket
CREATE POLICY "Users can upload to originals bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'originals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for authenticated users to view their own files in originals bucket
CREATE POLICY "Users can view own files in originals bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'originals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for authenticated users to delete their own files in originals bucket
CREATE POLICY "Users can delete own files in originals bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'originals' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for authenticated users to upload to processed bucket
CREATE POLICY "Users can upload to processed bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'processed' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for authenticated users to view their own files in processed bucket
CREATE POLICY "Users can view own files in processed bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'processed' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for authenticated users to delete their own files in processed bucket
CREATE POLICY "Users can delete own files in processed bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'processed' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow public access to files in both buckets (for public URLs)
CREATE POLICY "Public access to originals bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'originals');

CREATE POLICY "Public access to processed bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'processed');
/*
  # Create processed storage bucket

  1. New Storage
    - Create `processed` bucket for storing processed images
    - Enable public access for processed images
    - Set up RLS policies for authenticated users

  2. Security
    - Enable RLS on storage objects
    - Allow authenticated users to upload to their own folder
    - Allow public read access to processed images
    - Allow users to delete their own processed images
*/

-- Create the processed bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('processed', 'processed', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload files to their own folder in processed bucket
CREATE POLICY "Users can upload to own folder in processed bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'processed' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow public read access to processed bucket
CREATE POLICY "Public read access for processed bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'processed');

-- Policy to allow users to update their own files in processed bucket
CREATE POLICY "Users can update own files in processed bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'processed' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'processed' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to delete their own files in processed bucket
CREATE POLICY "Users can delete own files in processed bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'processed' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
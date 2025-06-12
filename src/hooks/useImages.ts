import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type ImageRecord = Database['public']['Tables']['images']['Row'];

export function useImages() {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [user]);

  const createImageRecord = async (originalUrl: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('images')
      .insert({
        user_id: user.id,
        original_url: originalUrl,
      })
      .select()
      .single();

    if (error) throw error;
    
    setImages(prev => [data, ...prev]);
    return data;
  };

  const updateImageRecord = async (id: string, processedUrl: string) => {
    const { data, error } = await supabase
      .from('images')
      .update({ processed_url: processedUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setImages(prev => 
      prev.map(img => img.id === id ? data : img)
    );
    return data;
  };

  const deleteImage = async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    // Delete from storage
    if (image.original_url) {
      const originalPath = image.original_url.split('/').pop();
      if (originalPath) {
        await supabase.storage
          .from('originals')
          .remove([`${user?.id}/${originalPath}`]);
      }
    }

    if (image.processed_url) {
      const processedPath = image.processed_url.split('/').pop();
      if (processedPath) {
        await supabase.storage
          .from('processed')
          .remove([`${user?.id}/${processedPath}`]);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setImages(prev => prev.filter(img => img.id !== id));
  };

  const uploadToStorage = async (file: File, bucket: 'originals' | 'processed') => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return {
    images,
    loading,
    createImageRecord,
    updateImageRecord,
    deleteImage,
    uploadToStorage,
    refetch: fetchImages,
  };
}
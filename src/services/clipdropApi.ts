const CLIPDROP_API_URL = 'https://clipdrop-api.co/remove-background/v1';
const API_KEY = 'e7096a97880078440df948cb4bb8b336aa569bf02030b8e413fb840a09dbf2c3bdf71188e588c6712b5b26cce6d197e2';

export async function processImage(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append('image_file', file);

  try {
    const response = await fetch(CLIPDROP_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (response.status === 402) {
        throw new Error('API quota exceeded. Please try again tomorrow.');
      } else if (response.status === 400) {
        throw new Error('Invalid image format. Please use JPG or PNG.');
      } else if (response.status === 413) {
        throw new Error('Image too large. Please use an image smaller than 10MB.');
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
}
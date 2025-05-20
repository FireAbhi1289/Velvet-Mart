
'use server';

import { z } from 'zod';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

interface ImgBBResponseData {
  data: {
    url: string;
    display_url: string;
    thumb: {
        url: string;
    };
    // Add other fields from ImgBB response if needed
  };
  success: boolean;
  status: number;
}

interface ImgBBErrorResponse {
    success: boolean;
    status: number;
    error: {
        message: string;
        code: number;
    };
}


export async function uploadImageToImgBB(
  formData: FormData
): Promise<{ success: boolean; url?: string; displayUrl?: string; thumbnailUrl?: string; error?: string }> {
  if (!IMGBB_API_KEY) {
    console.error('ImgBB API key is not configured. Please set IMGBB_API_KEY environment variable.');
    return { success: false, error: 'Image upload service is not configured.' };
  }

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorResult = result as ImgBBErrorResponse;
      console.error('ImgBB API Error:', errorResult);
      return {
        success: false,
        error: errorResult.error?.message || `Failed to upload image (status: ${response.status})`,
      };
    }

    const successResult = result as ImgBBResponseData;
    return {
      success: true,
      url: successResult.data.url, // This is the direct link to the image
      displayUrl: successResult.data.display_url, // URL to view the image on ImgBB
      thumbnailUrl: successResult.data.thumb.url // Thumbnail URL
    };
  } catch (error: any) {
    console.error('Error uploading image to ImgBB:', error);
    return { success: false, error: error.message || 'An unknown error occurred during image upload.' };
  }
}

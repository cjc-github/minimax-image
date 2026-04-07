import { useState, useCallback } from 'react';
import { getApiService } from '../services/api';
import type { GenerateRequest, GeneratedImage, GenerationSettings } from '../types';

interface UseImageGenerationReturn {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  generate: (prompt: string, settings: GenerationSettings, subjectReference?: string) => Promise<void>;
  clearImages: () => void;
}

export const useImageGeneration = (): UseImageGenerationReturn => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (
    prompt: string,
    settings: GenerationSettings,
    subjectReference?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const request: GenerateRequest = {
        model: settings.model,
        prompt,
        aspect_ratio: settings.aspect_ratio,
        n: settings.n,
        prompt_optimizer: settings.prompt_optimizer,
        aigc_watermark: settings.aigc_watermark,
        response_format: 'url',
      };

      if (settings.model === 'image-01') {
        request.width = settings.width;
        request.height = settings.height;
      }

      if (settings.seed !== undefined && settings.seed !== null) {
        request.seed = settings.seed;
      }

      if (settings.model === 'image-01-live' && settings.style) {
        request.style = settings.style;
      }

      if (subjectReference) {
        request.subject_reference = [{
          type: 'character',
          image_file: subjectReference,
        }];
      }

      const apiService = getApiService();
      const response = await apiService.generateImage(request);

      if (response.success && response.data?.image_urls) {
        const newImages: GeneratedImage[] = response.data.image_urls.map((url) => ({
          url,
          timestamp: Date.now(),
        }));

        setImages((prev) => [...newImages, ...prev]);
      } else {
        setError(response.error?.message || 'Failed to generate images');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return {
    images,
    isLoading,
    error,
    generate,
    clearImages,
  };
};

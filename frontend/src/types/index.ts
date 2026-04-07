export interface StyleConfig {
  style_type?: '漫画' | '元气' | '中世纪' | '水彩';
  style_weight?: number;
}

export interface SubjectReference {
  type: 'character';
  image_file: string;
}

export interface GenerateRequest {
  model: 'image-01' | 'image-01-live';
  prompt: string;
  aspect_ratio?: '1:1' | '16:9' | '4:3' | '3:2' | '3:4' | '9:16' | '21:9';
  width?: number;
  height?: number;
  style?: StyleConfig;
  subject_reference?: SubjectReference[];
  response_format?: 'url' | 'base64';
  seed?: number;
  n?: number;
  prompt_optimizer?: boolean;
  aigc_watermark?: boolean;
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    image_urls?: string[];
    image_base64?: string[];
  };
  metadata?: {
    success_count: string;
    failed_count: string;
  };
  error?: {
    code: number;
    message: string;
  };
}

export interface GenerationSettings {
  model: 'image-01' | 'image-01-live';
  aspect_ratio: '1:1' | '16:9' | '4:3' | '3:2' | '3:4' | '9:16' | '21:9';
  width: number;
  height: number;
  n: number;
  prompt_optimizer: boolean;
  aigc_watermark: boolean;
  seed?: number;
  style?: StyleConfig;
}

export interface GeneratedImage {
  url: string;
  base64?: string;
  timestamp: number;
}

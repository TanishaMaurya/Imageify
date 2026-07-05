export type ImageStyle = 'Realistic' | 'Anime' | 'Digital Art' | 'Sketch';
export type AspectRatio = '1:1' | '16:9' | '9:16';

export interface GeneratedImage {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  style: string;
  aspectRatio: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface GenerateRequest {
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
}

export interface GenerateResult {
  image: GeneratedImage;
  credits: number;
}

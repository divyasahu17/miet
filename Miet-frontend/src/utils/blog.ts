import { getBackendUrl } from '@/utils/api';

export type BlogPostType = 'blog' | 'vlog';

export interface BlogMediaAsset {
  type?: 'image' | 'video' | string;
  url?: string;
  src?: string;
  path?: string;
  thumbnail?: string;
  mime_type?: string;
  mimeType?: string;
  original_name?: string;
  [key: string]: unknown;
}

export interface BlogRecord {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  status: string;
  thumbnail?: string;
  cover_photo?: string;
  media_assets?: BlogMediaAsset[] | string | null;
  post_type?: BlogPostType | string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
}

const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv', '.ogv', '.ogg'];

export const resolveBlogAssetUrl = (value?: string | null) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;

  const backendUrl = getBackendUrl();
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${backendUrl}${normalizedPath}`;
};

const inferAssetType = (asset: BlogMediaAsset, url: string) => {
  const mimeType = String(asset.mime_type ?? asset.mimeType ?? '').toLowerCase();
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';

  const lowerUrl = url.toLowerCase();
  if (videoExtensions.some((extension) => lowerUrl.endsWith(extension))) return 'video';
  return 'image';
};

export const normalizeBlogMediaAssets = (assets: BlogRecord['media_assets']) => {
  if (!assets) return [] as Array<BlogMediaAsset & { url: string; type: 'image' | 'video' }>;

  let parsedAssets: unknown = assets;
  if (typeof assets === 'string') {
    try {
      parsedAssets = JSON.parse(assets);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsedAssets)) return [];

  return parsedAssets
    .map((asset) => {
      const normalizedAsset = typeof asset === 'string' ? { url: asset } : (asset || {});
      const rawUrl = String(
        (normalizedAsset as BlogMediaAsset).url ??
        (normalizedAsset as BlogMediaAsset).src ??
        (normalizedAsset as BlogMediaAsset).path ??
        (normalizedAsset as BlogMediaAsset).thumbnail ??
        ''
      );

      if (!rawUrl) return null;

      const url = resolveBlogAssetUrl(rawUrl);
      const type = inferAssetType(normalizedAsset as BlogMediaAsset, rawUrl);

      return {
        ...(normalizedAsset as BlogMediaAsset),
        url,
        type,
      };
    })
    .filter(Boolean) as Array<BlogMediaAsset & { url: string; type: 'image' | 'video' }>;
};

export const getBlogCoverPhotoUrl = (blog: Pick<BlogRecord, 'cover_photo' | 'thumbnail'>) => {
  return resolveBlogAssetUrl(blog.cover_photo ?? blog.thumbnail ?? '') || '/intro.webp';
};

export const getBlogPrimaryVideoUrl = (blog: Pick<BlogRecord, 'video_url' | 'media_assets'>) => {
  if (blog.video_url) {
    return resolveBlogAssetUrl(blog.video_url);
  }

  const mediaAssets = normalizeBlogMediaAssets(blog.media_assets);
  const videoAsset = mediaAssets.find((asset) => asset.type === 'video');
  return videoAsset?.url ?? '';
};

export const getBlogSlug = (blog: { id: number; title: string }) => {
  const cleanTitle = (blog.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return cleanTitle || String(blog.id);
};
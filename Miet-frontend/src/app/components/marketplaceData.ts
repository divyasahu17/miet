export type MarketplaceProductType = 'Course' | 'E-book' | 'App' | 'Gadget';
export interface MarketplaceProduct {
  id: number;
  category: MarketplaceProductType | string;
  title?: string;
  name?: string;
  desc: string;
  price?: string;
  image?: string;
  video_url?: string;
  pdf_file?: string;
  author?: string;
  download_link?: string;
  icon?: string;
  purchase_link?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
} 
export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  created_at: string;
}

export interface Consultant {
  id?: number;
  user_id?: number;
  username?: string;
  password?: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  description?: string;
  tagline?: string;
  location_lat?: string;
  location_lng?: string;
  address?: string;
  website?: string;
  speciality?: string;
  id_proof_type?: string;
  id_proof_url?: string;
  aadhar?: string;
  bank_account?: string;
  bank_ifsc?: string;
  status?: 'online' | 'offline';
  approval_status?: string;
  account_status?: string;
  featured?: boolean;
  category_ids?: number[] | string[];
  subcategory_ids?: number[] | string[];
  slots?: string[];
  city?: string;
  country?: string;
  commission_percent?: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
  status?: string;
  created_at?: string;
}

export type ConsultantForm = Partial<Consultant> & {
  confirmPassword?: string;
  category_ids: string[];
  subcategory_ids: string[];
};

export interface ServiceType {
  id?: number;
  name: string;
  description: string;
  delivery_mode: string;
  service_type: string;
  appointment_type?: string;
  event_type?: string;
  test_type?: string;
  revenue_type?: string;
  price?: string;
  renewal_date?: string;
  center?: string;
  test_redirect_url?: string;
  consultant_ids?: string[];
  category_ids?: string[];
  subcategory_ids?: string[];
  suggestions?: { title: string; description: string; redirect_url: string }[];
  subscription_start?: string;
  subscription_end?: string;
  discount?: string;
  monthly_price?: string;
  yearly_price?: string;
  center_address?: string;
  center_lat?: string;
  center_lng?: string;
  event_start?: string;
  event_end?: string;
  event_image?: string;
  event_meet_link?: string;
  created_at?: string;
}

export type ProductType = 'Course' | 'E-book' | 'App' | 'Gadget';

export interface Product {
  id?: number;
  type: ProductType;
  product_type?: string;
  title?: string;
  name?: string;
  description: string;
  price?: string;
  thumbnail?: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  video_url?: string;
  pdf_url?: string;
  icon_url?: string;
  product_image?: string;
  thumbnailFile?: File;
  pdfFile?: File;
  iconFile?: File;
  productImageFile?: File;
  author?: string;
  download_link?: string;
  purchase_link?: string;
  subtitle?: string;
  duration?: string;
  total_lectures?: number;
  language?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  learning_objectives?: string[];
  requirements?: string[];
  course_content?: { section: string; lectures: number; duration: string; items: string[] }[];
  instructor_name?: string;
  instructor_title?: string;
  instructor_bio?: string;
  instructor_image?: string;
  instructorImageFile?: File;
  rating?: number;
  total_ratings?: number;
  enrolled_students?: number;
  pdf_file?: string;
  icon?: string;
}

export interface Blog {
  id?: number;
  title: string;
  description: string;
  category: 'Therapy' | 'Mental Health' | 'Education' | 'Support' | 'Technology' | string;
  thumbnail?: string;
  cover_photo?: string;
  media_assets?: { type?: string; url?: string; src?: string; mime_type?: string }[] | string | null;
  post_type?: 'blog' | 'vlog' | string;
  video_url?: string;
  author: string;
  status: 'active' | 'inactive' | 'published' | 'draft' | 'pending' | 'archived' | 'live' | 'scheduled' | 'private' | 'public' | 'review' | 'approved' | 'rejected' | 'trash' | 'deleted' | string;
  created_at?: string;
  updated_at?: string;
}

export interface Webinar {
  id?: number;
  webinar_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_attendees?: number;
  current_attendees?: number;
  price?: number;
  is_free?: boolean;
  attendee_emails?: string[];
  meeting_notes?: string;
  organizer_email?: string;
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
  google_meet_link?: string;
  google_calendar_event_id?: string;
  platform_type?: 'google_meet' | 'zoom' | 'teams' | 'others';
  manual_link?: string;
  registration_fields?: { name: string; type: string }[];
  joining_email_template?: string;
  reminder_email_template?: string;
  recording_email_template?: string;
  reminder_schedule?: any[];
  recording_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Consultation {
  id?: number;
  appointment_id?: string;
  consultant_id: number;
  user_id?: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  meeting_type: 'consultation' | 'webinar';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  google_meet_link?: string;
  google_calendar_event_id?: string;
  price?: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_id?: string;
  attendee_emails?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id?: number;
  title: string;
  description: string;
  image_path: string;
  video_path?: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at?: string;
  remove_image?: boolean;
  remove_video?: boolean;
}

export interface CmsItem {
  id?: number;
  page_key: string;
  section_key: string;
  field_key: string;
  field_value: string;
  field_type: 'text' | 'textarea' | 'html' | 'image' | 'number' | 'json';
}

export type DashboardMenuKey = 'dashboard' | 'categories' | 'subcategories' | 'consultants' | 'users' | 'services' | 'products' | 'orders' | 'blogs' | 'webinars' | 'consultations' | 'gallery' | 'cms' | 'subscriptions' | 'coupons';

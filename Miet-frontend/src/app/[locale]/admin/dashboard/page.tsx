"use client";
import CmsTab from './tabs/CmsTab';
import GalleryTab from './tabs/GalleryTab';
import ConsultationsTab from './tabs/ConsultationsTab';
import WebinarsTab from './tabs/WebinarsTab';
import BlogsTab from './tabs/BlogsTab';
import OrdersTab from './tabs/OrdersTab';
import CouponsTab from './tabs/CouponsTab';
import SubscriptionsTab from './tabs/SubscriptionsTab';
import ProductsTab from './tabs/ProductsTab';
import ServicesTab from './tabs/ServicesTab';
import UsersTab from './tabs/UsersTab';
import ConsultantsTab from './tabs/ConsultantsTab';
import CategoriesTab from './tabs/CategoriesTab';
import SubcategoriesTab from './tabs/SubcategoriesTab';
import DashboardTab from './tabs/DashboardTab';


import React, { useEffect, useState, useMemo,useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getApiUrl } from "@/utils/api";
import { normalizeConsultantApproval } from "@/utils/consultant";
import { useNotifications } from "@/components/NotificationSystem";
import Select from "react-select";
import styles from './admin.module.css';
import { DashboardDataTable, AdminTableContext } from './DashboardDataTable';
import {
  Blog,
  Category,
  CmsItem,
  Consultant,
  ConsultantForm,
  Consultation,
  DashboardMenuKey,
  GalleryImage,
  Product,
  ProductType,
  ServiceType,
  Subcategory,
  User,
  Webinar,
} from './dashboard.types';
import {
  calculateEndTime,
  defaultMapCenter,
  filterAndSortData,
  formatDate,
  formatTime,
  getGalleryImageUrl,
  getImageUrl,
  getTotalPages,
  paginateData,
} from './dashboard.utils';
import { getBlogCoverPhotoUrl } from '@/utils/blog';

export default function AdminDashboard() {
  async function handleToggleApproval(c: any) {

    // console.log("CLICKED:", c); // 👈 ye add karo

    const token = localStorage.getItem("admin_jwt");

    const currentStatus = (c.approval_status ?? c.account_status ?? '').toString().toLowerCase();
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';

    await fetch(getApiUrl(`api/consultantsUpdate_approval`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: c.id,
        approval_status: newStatus,
        account_status: newStatus
      })
    });

    fetchConsultants();
  }











  



  const router = useRouter();
  const { addNotification } = useNotifications();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState<number | "">("");
  const [catEditId, setCatEditId] = useState<number | null>(null);
  const [subEditId, setSubEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ailmentsExpanded, setAilmentsExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'categories' | 'subcategories' | 'consultants' | 'users' | 'services' | 'products' | 'orders' | 'blogs' | 'webinars' | 'consultations' | 'gallery' | 'cms' | 'subscriptions' | 'coupons'>('dashboard');
  const [isClient, setIsClient] = useState(false);

  const categoryRef = useRef<HTMLSelectElement | null>(null);




  // Consultant state
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [consultantForm, setConsultantForm] = useState<ConsultantForm>({
    category_ids: [],
    subcategory_ids: [],
    username: '',
    password: '',
    name: '',
    email: '',
    city: '',
    status: 'offline',
    featured: false
  });
  const [consultantEditId, setConsultantEditId] = useState<number | null>(null);
  const [consultantProfile, setConsultantProfile] = useState<Consultant | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false); // for superadmin
  const [showConsultantProfileModal, setShowConsultantProfileModal] = useState(false); // for consultant details
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const [consultantSlots, setConsultantSlots] = useState<{ date: string; time: string; endTime?: string }[]>([]);
  const [slotDuration, setSlotDuration] = useState<number>(60); // Default 60 minutes
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [userForm, setUserForm] = useState<{ id?: number; username: string; password?: string; role: string }>({ username: '', password: '', role: 'consultant' });
  const [userEditId, setUserEditId] = useState<number | null>(null);
  // Services state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    delivery_mode: 'online',
    service_type: 'appointment',
    appointment_type: '',
    event_type: '',
    test_type: '',
    revenue_type: 'paid',
    price: '',
    renewal_date: '',
    center: '',
    test_redirect_url: '',
    consultant_ids: [] as string[],
    category_ids: [] as string[],
    subcategory_ids: [] as string[],
    suggestions: [{ title: '', description: '', redirect_url: '' }],
    subscription_start: '',
    subscription_end: '',
    discount: '',
    monthly_price: '',
    yearly_price: '',
    center_address: '',
    center_lat: '',
    center_lng: '',
    event_start: '',
    event_end: '',
    event_image: null as File | null,
    event_meet_link: '',
  });
  const [serviceEditId, setServiceEditId] = useState<number | null>(null);
  const [selectedConsultantIds, setSelectedConsultantIds] = useState<number[]>([]);
  const [consultantAvailability, setConsultantAvailability] = useState<Record<number, string[]>>({}); // consultantId -> array of slots
  const [consultationDate, setConsultationDate] = useState('');
  // Track if consultant form has been loaded for editing
  const [consultantFormLoaded, setConsultantFormLoaded] = useState(false);
  // Services state for list and modal
  const [services, setServices] = useState<ServiceType[]>([]);
  const [serviceProfile, setServiceProfile] = useState<ServiceType | null>(null);
  const [showServiceProfileModal, setShowServiceProfileModal] = useState(false);
  // Add state for name and email
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  // Add these states at the top of your component
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  // Add these states at the top of your component
  const [serviceFormLoading, setServiceFormLoading] = useState(false);
  const [serviceFormMessage, setServiceFormMessage] = useState('');
  // Product types and state
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<Partial<Product>>({ type: 'Course', status: 'active', featured: false });
  const [productEditId, setProductEditId] = useState<number | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductProfileModal, setShowProductProfileModal] = useState(false);
  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConsultantId, setDeleteConsultantId] = useState<number | null>(null);
  const [deleteConsultantName, setDeleteConsultantName] = useState<string>('');
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [deleteProductName, setDeleteProductName] = useState<string>('');

  // 🔥 Subscription State
  const [plans, setPlans] = useState<any[]>([]);
  const [planForm, setPlanForm] = useState({
    plan_key: 'basic',
    plan_name: '',
    billing_cycle: 'monthly',
    base_price: '',
    currency: 'INR',
    description: '',
    is_active: true
  });
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planEditId, setPlanEditId] = useState<number | null>(null);

  const [overrides, setOverrides] = useState<any[]>([]);
  const [overrideForm, setOverrideForm] = useState({
    user_id: '',
    plan_key: 'basic',
    billing_cycle: 'monthly',
    override_price: '',
    reason: '',
    starts_at: '',
    ends_at: '',
    is_active: true
  });
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideEditId, setOverrideEditId] = useState<number | null>(null);

  // 🔥 Coupon State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [couponForm, setCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discount_type: 'percent',
    discount_value: '',
    minimum_amount: '',
    maximum_discount: '',
    applicable_plan_key: '',
    billing_cycle: '',
    usage_limit: '',
    usage_limit_per_user: '',
    starts_at: '',
    ends_at: '',
    is_active: true
  });
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponEditId, setCouponEditId] = useState<number | null>(null);




  // Real-time dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Table states for all CRUD operations
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Webinar state
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [webinarForm, setWebinarForm] = useState<Webinar>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    duration_minutes: 60,
    max_attendees: 100,
    price: 0,
    is_free: true,
    attendee_emails: [],
    meeting_notes: '',
    status: 'scheduled'
  });
  const [showWebinarModal, setShowWebinarModal] = useState(false);
  const [webinarEditId, setWebinarEditId] = useState<number | null>(null);

  // Consultation state
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultationForm, setConsultationForm] = useState<Consultation>({
    consultant_id: 0,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    duration_minutes: 60,
    meeting_type: 'consultation',
    price: 0,
    attendee_emails: [],
    notes: '',
    status: 'scheduled',
    payment_status: 'pending'
  });
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationEditId, setConsultationEditId] = useState<number | null>(null);

  // Google OAuth state
  const [googleOAuthSetup, setGoogleOAuthSetup] = useState(false);

  // Modal states for all CRUD operations
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showConsultantModal, setShowConsultantModal] = useState(false);

  // Blog state
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [orders, setOrders] = useState([]);

  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    title: '',
    description: '',
    category: 'Therapy',
    thumbnail: '',
    cover_photo: '',
    author: '',
    status: 'active',
    post_type: 'blog',
    video_url: ''
  });
  const [blogEditId, setBlogEditId] = useState<number | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<number | null>(null);
  const [deleteBlogName, setDeleteBlogName] = useState<string>('');
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
  const [mediaImageFiles, setMediaImageFiles] = useState<File[]>([]);
  const [mediaVideoFiles, setMediaVideoFiles] = useState<File[]>([]);

  const resetBlogForm = () => {
    setBlogForm({
      title: '',
      description: '',
      category: 'Therapy',
      thumbnail: '',
      cover_photo: '',
      author: '',
      status: 'active',
      post_type: 'blog',
      video_url: ''
    });
    setCoverPhotoFile(null);
    setCoverPhotoPreview('');
    setMediaImageFiles([]);
    setMediaVideoFiles([]);
  };

  // Gallery state
  interface GalleryImage {
    id?: number;
    title: string;
    description: string;
    image_path: string;
    display_order: number;
    status: 'active' | 'inactive';
    created_at?: string;
  }
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryEditId, setGalleryEditId] = useState<number | null>(null);
  const [galleryEditForm, setGalleryEditForm] = useState<Partial<GalleryImage>>({});
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  // CMS state
  interface CmsItem {
    id?: number;
    page_key: string;
    section_key: string;
    field_key: string;
    field_value: string;
    field_type: 'text' | 'textarea' | 'html' | 'image' | 'number' | 'json';
  }
  const [cmsContent, setCmsContent] = useState<CmsItem[]>([]);
  const [cmsForm, setCmsForm] = useState<CmsItem>({
    page_key: 'home',
    section_key: '',
    field_key: '',
    field_value: '',
    field_type: 'text'
  });
  const [cmsEditId, setCmsEditId] = useState<number | null>(null);
  const [showCmsModal, setShowCmsModal] = useState(false);
  const [cmsPageFilter, setCmsPageFilter] = useState('all');

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle OAuth success message
  useEffect(() => {
    if (!isClient) return;

    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const message = urlParams.get('message');

    if (oauthSuccess === 'true' && message) {
      alert(decodeURIComponent(message));
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      setGoogleOAuthSetup(true);
    }
  }, [isClient]);

  // Auth check
  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router, isClient]);

  // Fetch categories/subcategories
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (activeMenu === 'consultants') fetchConsultants();
  }, [activeMenu]);

  useEffect(() => {
    if (activeMenu === 'services') fetchConsultants();
  }, [activeMenu]);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/categories"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      setCategories(await res.json());
    } catch {
      // setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }
  async function fetchSubcategories() {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/subcategories"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      setSubcategories(await res.json());
    } catch {
      // setError("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  }






  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  async function fetchConsultants(pageNo = 1) {
    try {
      const query = new URLSearchParams();

      if (cityFilter) query.append("city", cityFilter);
      if (statusFilter) query.append("status", statusFilter);

      // 🔥 pagination params add karo
      query.append("page", pageNo.toString());
      query.append("limit", limit.toString());

      const token = localStorage.getItem("admin_jwt");

      const res = await fetch(
        getApiUrl(`api/consultants?${query.toString()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const response = await res.json();

        // 🔥 IMPORTANT CHANGE
        const consultantsData = response.data;

        setTotalPages(response.totalPages);
        setPage(response.page);

        // slots mapping
        const consultantsWithSlots = await Promise.all(
          consultantsData.map(async (rawConsultant: any) => {
            const c = normalizeConsultantApproval(rawConsultant);
            try {
              const slotRes = await fetch(
                getApiUrl(`api/consultants/${c.id}/availability`),
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (slotRes.ok) {
                const slots = await slotRes.json();

                return {
                  ...c,
                  slots: slots.map(
                    (slot: any) =>
                      `${slot.date} ${slot.start_time}${
                        slot.end_time ? "-" + slot.end_time : ""
                      }`
                  ),
                };
              } else {
                return { ...c, slots: [] };
              }
            } catch (error) {
              return { ...c, slots: [] };
            }
          })
        );

        setConsultants(consultantsWithSlots);
      } else {
        setConsultants([]);
      }
    } catch (error) {
      setConsultants([]);
    }
  }

  useEffect(() => {
  fetchConsultants(page);
}, [page, cityFilter, statusFilter]);

  // Fetch users
  async function fetchUsers() {
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl("api/users"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
  }
  useEffect(() => {
    if (activeMenu === 'users') fetchUsers();
  }, [activeMenu]);

  // Fetch services
  async function fetchServices() {
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(getApiUrl("api/services"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setServices(await res.json());
    }
  }
  useEffect(() => {
    if (activeMenu === 'services') fetchServices();
  }, [activeMenu]);

  // Fetch products
  async function fetchProducts() {
    try {
      const res = await fetch(getApiUrl('api/products'));
      if (res.ok) {
        const data = await res.json();

        // Extract products array from response
        const productsArray = data.products || data;

        setProducts(productsArray);
      } else {

        setProducts([]);
      }
    } catch (error) {

      setProducts([]);
    }
  }


// 🔥 Subscription Plans
async function fetchPlans() {
  const token = localStorage.getItem("admin_jwt");
  const res = await fetch(getApiUrl("api/admin/subscription-plans"), { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) setPlans((await res.json())?.data || []);
}

async function handlePlanSubmit(e: React.FormEvent) {
  e.preventDefault();
  const token = localStorage.getItem("admin_jwt");
  
  const endpoint = planEditId
    ? getApiUrl(`api/admin/subscription-plans/${planEditId}`)
    : getApiUrl("api/admin/subscription-plans");
  
  const method = planEditId ? "PUT" : "POST";

  await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(planForm),
  });

  setShowPlanModal(false);
  fetchPlans();
}

async function handlePlanDelete(id: number) {
  if (!confirm("Delete?")) return;
  const token = localStorage.getItem("admin_jwt");
  await fetch(getApiUrl(`api/admin/subscription-plans/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchPlans();
}

// 🔥 Price Overrides
async function fetchOverrides() {
  const token = localStorage.getItem("admin_jwt");
  const res = await fetch(getApiUrl("api/admin/subscription-price-overrides"), { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) setOverrides((await res.json())?.data || []);
}

async function handleOverrideSubmit(e: React.FormEvent) {
  e.preventDefault();
  const token = localStorage.getItem("admin_jwt");
  
  const endpoint = overrideEditId
    ? getApiUrl(`api/admin/subscription-price-overrides/${overrideEditId}`)
    : getApiUrl("api/admin/subscription-price-overrides");
    
  const method = overrideEditId ? "PUT" : "POST";

  await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(overrideForm),
  });

  setShowOverrideModal(false);
  fetchOverrides();
}

async function handleOverrideDelete(id: number) {
  if (!confirm("Delete?")) return;
  const token = localStorage.getItem("admin_jwt");
  await fetch(getApiUrl(`api/admin/subscription-price-overrides/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchOverrides();
}

// 🔥 Coupon
async function fetchCoupons() {
  const token = localStorage.getItem("admin_jwt");
  const res = await fetch(getApiUrl("api/admin/subscription-coupons"), { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) setCoupons((await res.json())?.data || []);
}

async function handleCouponSubmit(e: React.FormEvent) {
  e.preventDefault();
  const token = localStorage.getItem("admin_jwt");
  
  const endpoint = couponEditId
    ? getApiUrl(`api/admin/subscription-coupons/${couponEditId}`)
    : getApiUrl("api/admin/subscription-coupons");
    
  const method = couponEditId ? "PUT" : "POST";

  await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(couponForm),
  });

  setShowCouponModal(false);
  fetchCoupons();
}

async function handleCouponDelete(id: number) {
  if (!confirm("Delete?")) return;
  const token = localStorage.getItem("admin_jwt");
  await fetch(getApiUrl(`api/admin/subscription-coupons/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchCoupons();
}

useEffect(() => {
  if (activeMenu === 'subscriptions') {
    fetchPlans();
    fetchOverrides();
  }
}, [activeMenu]);

useEffect(() => {
  if (activeMenu === 'coupons') fetchCoupons();
}, [activeMenu]);





  useEffect(() => {
    if (activeMenu === 'products') fetchProducts();
  }, [activeMenu]);

  // Fetch webinars
  async function fetchWebinars() {
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl("api/webinars"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWebinars(data.webinars || []);
      }
    } catch (error) {

      setWebinars([]);
    }
  }

  useEffect(() => {
    if (activeMenu === 'webinars') fetchWebinars();
  }, [activeMenu]);



  
const fetchOrders = async () => {

  try {

    const token = localStorage.getItem("admin_jwt");

    const res = await fetch(getApiUrl("api/ordersAdmin"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("ORDERS DATA:", data);

    setOrders(data.orders || []);

  } catch (error) {

    console.log("Orders fetch error:", error);

  }

};

  // Fetch consultations
  async function fetchConsultations() {
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl("api/admin/consultations"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConsultations(data.consultations || []);
      }
    } catch (error) {

      setConsultations([]);
    }
  }

  useEffect(() => {
    if (activeMenu === 'consultations') {
      fetchConsultations();
      fetchConsultants(); // Also fetch consultants for the dropdown
    }
  }, [activeMenu]);

  // Debug: Log products state changes
  useEffect(() => {


    if (Array.isArray(products)) {


    }
  }, [products]);

  // Category CRUD
  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = catEditId ? "PUT" : "POST";
      const url = catEditId ? getApiUrl(`api/categories/${catEditId}`) : getApiUrl("api/categories");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_jwt")}`,
        },
        body: JSON.stringify({ name: catName }),
      });
      if (!res.ok) throw new Error("Failed to save category");
      setCatName("");
      setCatEditId(null);
      setShowCategoryModal(false);
      fetchCategories();
    } catch {
      // setError("Failed to save category");
    } finally {
      setLoading(false);
    }
  }
  async function handleCatEdit(cat: Category) {
    setCatEditId(cat.id);
    setCatName(cat.name);
  }
  async function handleCatDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`api/categories/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error();
      fetchCategories();
    } catch {
      // setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  // Subcategory CRUD
  async function handleSubSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = subEditId ? "PUT" : "POST";
      const url = subEditId ? getApiUrl(`api/subcategories/${subEditId}`) : getApiUrl("api/subcategories");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_jwt")}`,
        },
        body: JSON.stringify({ name: subName, category_id: subCatId }),
      });
      if (!res.ok) throw new Error("Failed to save subcategory");
      setSubName("");
      setSubCatId("");
      setSubEditId(null);
      setShowSubcategoryModal(false);
      fetchSubcategories();
    } catch {
      // setError("Failed to save subcategory");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubEdit(sub: Subcategory) {
    setSubEditId(sub.id);
    setSubName(sub.name);
    setSubCatId(sub.category_id);
  }
  async function handleSubDelete(id: number) {
    if (!confirm("Delete this subcategory?")) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`api/subcategories/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_jwt")}` },
      });
      if (!res.ok) throw new Error();
      fetchSubcategories();
    } catch {
      // setError("Failed to delete subcategory");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_jwt");
    router.replace("/admin/login");
  }

  // Sidebar menu items
  const menu = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaThLarge size={20} /> },
    {
      key: 'ailments',
      label: 'Ailments',
      icon: <FaTags size={20} />,
      children: [
        { key: 'categories', label: 'Categories', icon: <FaTags size={18} /> },
        { key: 'subcategories', label: 'Subcategories', icon: <FaList size={18} /> },
      ],
    },
    { key: 'consultants', label: 'Consultants', icon: <FaUserMd size={20} /> },
    { key: 'users', label: 'Users', icon: <FaUserCircle size={20} /> },
    { key: 'services', label: 'Services', icon: <FaTags size={20} /> },
    { key: 'products', label: 'Products', icon: <FaList size={20} /> },
    { key: 'orders', label: 'Orders', icon: <FaList size={20} /> },
    { key: 'blogs', label: 'Blogs & Media', icon: <FaList size={20} /> },
    { key: 'webinars', label: 'Webinars', icon: <FaList size={20} /> },
    { key: 'consultations', label: 'Consultations', icon: <FaUserMd size={20} /> },
    { key: 'gallery', label: 'Gallery', icon: <FaImages size={20} /> },
    { key: 'cms', label: 'CMS / Pages', icon: <FaCog size={20} /> },
    { key: 'subscriptions', label: 'Subscriptions', icon: <FaTags size={20} /> },
    { key: 'coupons', label: 'Coupons', icon: <FaTags size={20} /> },

  ];

  // Helper to save slots to backend
  async function saveConsultantSlots(consultantId: number, slots: { date: string; time: string; endTime?: string }[]) {
    // First, fetch existing slots and delete them all (for update)
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl(`api/consultants/${consultantId}/availability`), { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const existing = await res.json();
      for (const slot of existing) {
        await fetch(getApiUrl(`api/consultants/${consultantId}/availability/${slot.id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      }
    }
    // Add new slots
    for (const slot of slots) {
      if (slot.date && slot.time) {
        await fetch(getApiUrl(`api/consultants/${consultantId}/availability`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ date: slot.date, start_time: slot.time, end_time: slot.endTime || '' })
        });
      }
    }
  }

  // Consultant CRUD
  async function handleConsultantSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    // Validate Gmail address
    if (!consultantForm.email || !consultantForm.email.endsWith('@gmail.com')) {
      alert('Please enter a valid Gmail address for the consultant. Gmail is required for Google Meet invitations and calendar integration.');
      return;
    }

    try {
      const token = localStorage.getItem("admin_jwt");
      const method = consultantEditId ? "PUT" : "POST";
      const url = consultantEditId ? getApiUrl(`api/consultants/${consultantEditId}`) : getApiUrl('api/consultants');

      // Convert category_ids and subcategory_ids to number[] before submitting
      const payload = {
        ...consultantForm,
        category_ids: Array.isArray(consultantForm.category_ids) ? consultantForm.category_ids.map(Number) : [],
        subcategory_ids: Array.isArray(consultantForm.subcategory_ids) ? consultantForm.subcategory_ids.map(Number) : [],
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        let consultantId = consultantEditId;
        if (!consultantEditId) {
          const data = await res.json();
          consultantId = data.id;
        }
        if (consultantId) {
          await saveConsultantSlots(consultantId, consultantSlots);
        }
        setConsultantForm({
          category_ids: [],
          subcategory_ids: [],
          username: '',
          password: '',
          name: '',
          email: '',
          city: '',
          status: 'offline',
          featured: false
        });
        setConsultantEditId(null);
        setConsultantSlots([]);
        setConsultantFormLoaded(false);
        setShowConsultantModal(false);
        fetchConsultants();

      } else {
        const errorData = await res.text();

        alert(`Failed to save consultant: ${res.status} ${errorData}`);
      }
    } catch (error) {

      alert('Error saving consultant. Please try again.');
    }
  }
  async function handleConsultantEdit(c: Consultant) {
    if (typeof c.id === 'number') {
      setConsultantEditId(c.id);
      // Username should already be included from fetchConsultants, but ensure it's set
      setConsultantForm({
        ...c,
        username: c.username || c.email || '', // Use username from consultant data or fallback to email
        password: '', // Don't pre-fill password for security
        category_ids: Array.isArray(c.category_ids) ? c.category_ids.map(id => String(id)) : [],
        subcategory_ids: Array.isArray(c.subcategory_ids) ? c.subcategory_ids.map(id => String(id)) : [],
      });
      // Fetch slots from backend
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/consultants/${c.id}/availability`), { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const slots = await res.json();
        setConsultantSlots(slots.map((slot: { date: string; start_time: string; end_time: string; id: number }) => ({ date: slot.date, time: slot.start_time, endTime: slot.end_time })));
      } else {
        setConsultantSlots([]);
      }
      setConsultantFormLoaded(true);
    }
  }
  // Show delete confirmation modal
  function showDeleteConsultantModal(id: number, name: string) {
    setDeleteConsultantId(id);
    setDeleteConsultantName(name);
    setShowDeleteModal(true);
  }
  // Refactor delete handlers to use modal
  async function handleConsultantDelete() {
    if (!deleteConsultantId) return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl(`api/consultants/${deleteConsultantId}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchConsultants();
      setShowDeleteModal(false);
      setDeleteConsultantId(null);
      setDeleteConsultantName('');
    }
  }
  async function handleConsultantProfile(id?: number) {
    if (typeof id !== 'number') return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl(`api/consultants/${id}`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setConsultantProfile(await res.json());
  }
  const handleConsultantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setConsultantForm({ ...consultantForm, [e.target.name]: e.target.value });
  }
  const handleConsultantFormCancel = () => {
    setConsultantEditId(null);
    setConsultantForm({
      category_ids: [],
      subcategory_ids: [],
      username: '',
      password: '',
      name: '',
      email: '',
      city: '',
      status: 'offline',
      featured: false
    });
    setConsultantSlots([]);
    setConsultantFormLoaded(false);
  };

  // File upload placeholder
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'id_proof_url') {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(getApiUrl('api/upload'), {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      // Use the URL as-is
      setConsultantForm(f => ({ ...f, [field]: data.url }));
    } catch {
      alert('Image upload failed.');
    }
  }

  // Multi-select handlers
  const handleConsultantMultiSelect = (field: string, values: string[] | number[]) => {
    setConsultantForm(f => ({ ...f, [field]: values }));
  };

  // Use My Location
  function handleUseMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setConsultantForm(f => ({ ...f, location_lat: String(pos.coords.latitude), location_lng: String(pos.coords.longitude) }));
      });
    } else {
      alert('Geolocation not supported.');
    }
  }

  const categoryOptions = categories.map(cat => ({
    value: String(cat.id),
    label: cat.name
  }));

  const subcategoryOptions = subcategories
    .filter(sub =>
      serviceForm.category_ids.includes(String(sub.category_id))
    )
    .map(sub => ({
      value: String(sub.id),
      label: sub.name
    }));

  const consultantOptions = consultants.map(c => ({
    value: String(c.id),
    label: `${c.name} (${c.email})`
  }));


  function handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      setConsultantForm(f => ({
        ...f,
        location_lat: String(event.latLng!.lat()),
        location_lng: String(event.latLng!.lng())
      }));
    }
  }
  async function handleToggleConsultantStatus(c: Consultant) {
    const token = localStorage.getItem("admin_jwt");
    const newStatus = c.status === 'online' ? 'offline' : 'online';
    await fetch(getApiUrl(`api/consultants/${c.id}/status`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    fetchConsultants();
  }

  // Users CRUD
  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_jwt");
    const method = userEditId ? "PUT" : "POST";
    const url = userEditId ? getApiUrl(`api/users/${userEditId}`) : getApiUrl('api/users');
    const body = userEditId ? { username: userForm.username, role: userForm.role } : userForm;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setUserForm({ username: '', password: '', role: 'consultant' });
      setUserEditId(null);
      setShowUserModal(false);
      fetchUsers();
    }
  }
  async function handleUserEdit(u: User) {
    setUserEditId(u.id);
    setUserForm({ id: u.id, username: u.username, role: u.role });
  }
  async function handleUserDelete(id: number) {
    if (!confirm("Delete this user?")) return;
    const token = localStorage.getItem("admin_jwt");
    const res = await fetch(getApiUrl(`api/users/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchUsers();
  }
  function handleUserFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }
  function handleUserFormCancel() {
    setUserForm({ username: '', password: '', role: 'consultant' });
    setUserEditId(null);
  }

  async function handleToggleUserStatus(u: User) {
    const token = localStorage.getItem("admin_jwt");
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    await fetch(getApiUrl(`api/users/${u.id}/status`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    fetchUsers();
  }

  async function handleToggleBlogStatus(b: any) {
    const token = localStorage.getItem("admin_jwt");
    const isCurrentlyActive = b.status === 'active' || b.status === 'published' || b.status === 'live';
    const newStatus = isCurrentlyActive ? 'inactive' : 'active';

    const formData = new FormData();
    formData.append('title', b.title || '');
    formData.append('description', b.description || '');
    formData.append('category', b.category || 'Therapy');
    formData.append('author', b.author || '');
    formData.append('status', newStatus);
    formData.append('post_type', b.post_type || 'blog');

    try {
      const res = await fetch(getApiUrl(`api/blogs/${b.id}`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error toggling blog status:', error);
    }
  }

  // Service CRUD


  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault();

    setServiceFormLoading(true);
    setServiceFormMessage('');

    const token = localStorage.getItem('admin_jwt');
    const method = serviceEditId ? 'PUT' : 'POST';
    const url = serviceEditId
      ? getApiUrl(`api/services/${serviceEditId}`)
      : getApiUrl('api/services');

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(serviceForm),
      });

      const data = await res.json(); // ✅ now correct place
      console.log("SERVER RESPONSE:", data);

      if (res.ok) {
        setServiceFormMessage('Service submitted successfully!');
        setShowServiceModal(false);
        fetchServices();
      } else {
        setServiceFormMessage(data.message || 'Error submitting service.');
      }

    } catch (err) {
      console.error("FETCH ERROR:", err);
      setServiceFormMessage('Error submitting service.');
    } finally {
      setServiceFormLoading(false);
    }
  }


  const handleServiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      setServiceForm(f => ({ ...f, [name]: Array.from(options, opt => opt.value) }));
    } else {
      setServiceForm(f => ({ ...f, [name]: value }));
    }
  }



  
  function handleAddSuggestion() {
    setServiceForm(f => ({ ...f, suggestions: [...f.suggestions, { title: '', description: '', redirect_url: '' }] }));
  }
  function handleRemoveSuggestion(idx: number) {
    setServiceForm(f => ({ ...f, suggestions: f.suggestions.filter((_, i) => i !== idx) }));
  }
  function handleSuggestionChange(idx: number, field: string, value: string) {
    setServiceForm(f => ({ ...f, suggestions: f.suggestions.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
  }

  // When consultant_ids changes in serviceForm, update selectedConsultantIds and fetch/simulate availability
  useEffect(() => {
    const ids = (serviceForm.consultant_ids || []).map(Number).filter(Boolean);
    setSelectedConsultantIds(ids);
    // Fetch actual slots from the consultants array
    const avail: Record<number, string[]> = {};
    for (const id of ids) {
      const consultant = consultants.find(c => c.id === id);
      if (consultant && Array.isArray(consultant.slots)) {
        avail[id] = (consultant.slots as (string | { date: string; time: string; endTime?: string })[]).map(slot => {
          if (typeof slot === 'string') {
            return slot;
          } else if (typeof slot === 'object' && 'date' in slot && 'time' in slot) {
            return `${slot.date} ${slot.time}${slot.endTime ? '-' + slot.endTime : ''}`;
          }
          return '';
        }).filter(Boolean);
      } else {
        avail[id] = [];
      }
    }
    setConsultantAvailability(avail);
  }, [serviceForm.consultant_ids, consultants]);

  // Helper: get all available dates for selected consultants
  const getAvailableDates = () => {
    const allSlots = selectedConsultantIds.flatMap(cid => consultantAvailability[cid] || []);
    // Extract unique dates from slots (format: 'YYYY-MM-DD HH:MM-HH:MM')
    const dates = Array.from(new Set(allSlots.map(slot => slot.split(' ')[0])));
    return dates;
  };

  // Helper: get all blocked dates (dates with no available slots for any selected consultant)
  const getBlockedDates = () => {
    // Get all dates in the next 90 days
    const today = new Date();
    const blocked: string[] = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      if (!getAvailableDates().includes(dateStr)) {
        blocked.push(dateStr);
      }
    }
    return blocked;
  };

  // Helper: get available time slots for a given date, formatted
  const getTimeSlotsForDate = (date: string) => {
    return selectedConsultantIds.flatMap(cid =>
      (consultantAvailability[cid] || [])
        .filter(slot => slot.startsWith(date))
        .map(slot => {
          const time = slot.split(' ')[1];
          if (!time) return '';
          const [start, end] = time.split('-');
          if (end) {
            return `${formatTime(start)} - ${formatTime(end)}`;
          } else {
            return formatTime(start);
          }
        })
    );
  };

  // Add, edit, and remove slot handlers
  const handleAddSlot = () => {
    setConsultantSlots(slots => [...slots, { date: '', time: '', endTime: '' }]);
  };

  // Add slot with auto-calculated end time
  const handleAddSlotWithDuration = (date: string, startTime: string) => {
    const endTime = calculateEndTime(startTime, slotDuration);
    setConsultantSlots(slots => [...slots, { date, time: startTime, endTime }]);
  };

  // Quick add multiple slots for a time period
  const handleQuickAddSlots = (date: string, period: 'morning' | 'afternoon' | 'evening') => {
    if (!date) return;

    const periodTimes: { [key: string]: string[] } = {
      morning: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
      afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00'],
      evening: ['17:00', '18:00', '19:00', '20:00']
    };

    // Filter times based on duration to avoid overlap
    const times = periodTimes[period];
    const newSlots: { date: string; time: string; endTime: string }[] = [];

    for (let i = 0; i < times.length; i++) {
      const startTime = times[i];
      const endTime = calculateEndTime(startTime, slotDuration);

      // Check if end time exceeds period boundary
      const endHour = parseInt(endTime.split(':')[0]);
      if (period === 'morning' && endHour > 12) continue;
      if (period === 'afternoon' && endHour > 17) continue;
      if (period === 'evening' && endHour > 21) continue;

      // Check if slot already exists
      const exists = consultantSlots.some(
        slot => slot.date === date && slot.time === startTime
      );
      if (!exists) {
        newSlots.push({ date, time: startTime, endTime });
      }
    }

    if (newSlots.length > 0) {
      setConsultantSlots(slots => [...slots, ...newSlots]);
    }
  };

  const handleSlotChange = (idx: number, field: string, value: string) => {
    setConsultantSlots(slots => slots.map((slot, i) => {
      if (i !== idx) return slot;
      const updatedSlot = { ...slot, [field]: value };
      // Auto-calculate end time when start time changes and duration is set
      if (field === 'time' && value && slotDuration) {
        updatedSlot.endTime = calculateEndTime(value, slotDuration);
      }
      return updatedSlot;
    }));
  };
  const handleRemoveSlot = (idx: number) => {
    setConsultantSlots(slots => slots.filter((_, i) => i !== idx));
  };

  // Ensure form fields are hydrated after consultantForm is loaded for editing
  useEffect(() => {
    if (consultantEditId && consultantFormLoaded) {
      // Ensure category_ids and subcategory_ids are strings for select value
      setConsultantForm(f => ({
        ...f,
        category_ids: Array.isArray(f.category_ids) ? f.category_ids.map(id => String(id)) : [],
        subcategory_ids: Array.isArray(f.subcategory_ids) ? f.subcategory_ids.map(id => String(id)) : [],
      }));
    }
  }, [consultantEditId, consultantFormLoaded]);

  // Event image change handler
  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setServiceForm(prev => ({ ...prev, event_image: file }));
    }
  };

  // Generate Google Meet link
  const generateMeetLink = () => {
    // This is a placeholder and should be replaced with actual implementation
    return `https://meet.google.com/new?authuser=0&hs=177&authuser=0`;
  };

  // View service details
  async function handleServiceProfile(id: number) {
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(getApiUrl(`api/services/${id}`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setServiceProfile(await res.json());
      setShowServiceProfileModal(true);
    }
  }

  async function handleServiceEdit(s: ServiceType) {
    setServiceEditId(s.id ?? null);
    setServiceForm({
      name: s.name || '',
      description: s.description || '',
      delivery_mode: s.delivery_mode || 'online',
      service_type: s.service_type || 'appointment',

      appointment_type: s.appointment_type || '',
      event_type: s.event_type || '',
      test_type: s.test_type || '',
      revenue_type: s.revenue_type || 'paid',
      price: s.price || '',
      renewal_date: s.renewal_date || '',
      center: s.center || '',
      test_redirect_url: s.test_redirect_url || '',

     consultant_ids: (s.consultant_ids || []).map(id => String(id)),
     category_ids: (s.category_ids || []).map(id => String(id)),
     subcategory_ids: (s.subcategory_ids || []).map(id => String(id)),

      suggestions:
        s.suggestions && s.suggestions.length > 0
          ? s.suggestions
          : [{ title: '', description: '', redirect_url: '' }],

      subscription_start: s.subscription_start || '',
      subscription_end: s.subscription_end || '',
      discount: s.discount || '',
      monthly_price: s.monthly_price || '',
      yearly_price: s.yearly_price || '',
      center_address: s.center_address || '',
      center_lat: s.center_lat || '',
      center_lng: s.center_lng || '',
      event_start: s.event_start || '',
      event_end: s.event_end || '',
      event_image: null,
      event_meet_link: s.event_meet_link || '',
    });

    setShowServiceModal(true);
  }


  
  // Delete service
  async function handleServiceDelete(id: number) {
    if (!confirm('Delete this service?')) return;
    const token = localStorage.getItem('admin_jwt');
    const res = await fetch(getApiUrl(`api/services/${id}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchServices();
  }

  // Form submit handler for name and email
  const handleSimpleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage('');
    const data = { name: formName, email: formEmail };

    try {
      const res = await fetch(getApiUrl('submit-form'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setFormMessage('Form submitted successfully!');

    } catch (err) {
      setFormMessage('Error submitting form.');

    } finally {
      setFormLoading(false);
    }
  };

  // Fetch products on mount and after adding
  useEffect(() => {
    if (activeMenu === 'products') fetchProducts();
  }, [activeMenu]);

  // Fetch blogs on mount and after adding
  useEffect(() => {
    if (activeMenu === 'blogs') fetchBlogs();
  }, [activeMenu]);


useEffect(() => {
  if (activeMenu === 'orders') fetchOrders();
}, [activeMenu]);

useEffect(() => {
 console.log("ACTIVE MENU:", activeMenu);
}, [activeMenu]);

  // Auto-select first child when ailments is expanded
  useEffect(() => {
    if (ailmentsExpanded && activeMenu !== 'categories' && activeMenu !== 'subcategories') {
      setActiveMenu('categories');
    }
  }, [ailmentsExpanded]);

  // Auto-expand ailments when categories or subcategories are active
  useEffect(() => {
    if (activeMenu === 'categories' || activeMenu === 'subcategories') {
      setAilmentsExpanded(true);
    }
  }, [activeMenu]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Blog CRUD
  async function fetchBlogs() {
    try {
      const res = await fetch(getApiUrl('api/blogs'));
      if (res.ok) {
        const data = await res.json();

        const blogsArray = data.blogs || data;
        setBlogs(blogsArray);
      } else {

        setBlogs([]);
      }
    } catch (error) {

      setBlogs([]);
    }
  }

  async function handleBlogSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    try {
      const token = localStorage.getItem("admin_jwt");
      const isEditing = Boolean(blogEditId);
      const method = blogEditId ? "PUT" : "POST";
      const url = blogEditId
        ? getApiUrl(`api/blogs/${blogEditId}`)
        : getApiUrl('api/blogs');

      const formData = new FormData();
      formData.append('title', blogForm.title || '');
      formData.append('description', blogForm.description || '');
      formData.append('category', blogForm.category || 'Therapy');
      formData.append('author', blogForm.author || '');
      formData.append('status', blogForm.status || 'active');
      formData.append('post_type', blogForm.post_type || 'blog');

      if (coverPhotoFile) {
        formData.append('thumbnail', coverPhotoFile);
      } else if (blogForm.cover_photo) {
        formData.append('thumbnail', blogForm.cover_photo);
      } else if (blogForm.thumbnail) {
        formData.append('thumbnail', blogForm.thumbnail);
      }

      if (blogForm.video_url) formData.append('video_url', blogForm.video_url);

      mediaImageFiles.forEach((file) => formData.append('media_images', file));
      mediaVideoFiles.forEach((file) => formData.append('media_videos', file));

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        resetBlogForm();
        setBlogEditId(null);
        setShowBlogModal(false);
        fetchBlogs();
        addNotification({
          type: 'success',
          title: 'Success',
          message: isEditing ? 'Blog updated successfully!' : 'Blog added successfully!'
        });
      } else {
        const errorData = await res.text();
        addNotification({
          type: 'error',
          title: 'Error',
          message: `Failed to save blog: ${res.status} ${errorData}`
        });
      }
    } catch (error) {

      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error saving blog. Please try again.'
      });
    }
  }

  async function handleBlogEdit(blog: Blog) {
    setBlogEditId(blog.id ?? null);
    setBlogForm({
      ...blog,
      cover_photo: blog.cover_photo || blog.thumbnail || '',
      thumbnail: blog.thumbnail || blog.cover_photo || '',
      post_type: blog.post_type || 'blog',
      video_url: blog.video_url || ''
    });
    setCoverPhotoFile(null);
    setCoverPhotoPreview(getBlogCoverPhotoUrl(blog));
    setMediaImageFiles([]);
    setMediaVideoFiles([]);
    setShowBlogModal(true);
  }

  function handleCoverPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file for the cover photo.');
      return;
    }

    setCoverPhotoFile(file);
    setBlogForm((current) => ({ ...current, cover_photo: '', thumbnail: '' }));

    const reader = new FileReader();
    reader.onloadend = () => setCoverPhotoPreview(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  function handleMediaImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (files.length) setMediaImageFiles((current) => [...current, ...files]);
  }

  function handleMediaVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith('video/'));
    if (files.length) setMediaVideoFiles((current) => [...current, ...files]);
  }

  async function handleBlogDelete() {
    if (!deleteBlogId) return;

    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/blogs/${deleteBlogId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== deleteBlogId));
        setDeleteBlogId(null);
        setDeleteBlogName('');
        setShowDeleteModal(false);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Blog deleted successfully!'
        });
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {

      alert('Error deleting blog');
    }
  }

  // Gallery CRUD
  async function fetchGallery() {
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl('api/gallery?status=all'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  }

  async function handleGalleryUpload(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (galleryFiles.length === 0) { alert('Please select at least one image'); return; }
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      alert('Please log in to the admin panel first.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      galleryFiles.forEach(file => formData.append('images', file));
      formData.append('title', galleryTitle);
      formData.append('description', galleryDescription);
      formData.append('status', 'active');

      const res = await fetch(getApiUrl('api/gallery'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setGalleryFiles([]);
        setGalleryTitle('');
        setGalleryDescription('');
        setGalleryPreview([]);
        setShowGalleryModal(false);
        fetchGallery();
        addNotification({ type: 'success', title: 'Success', message: 'Images uploaded successfully!' });
      } else {
        const msg = data.error || data.message || `Upload failed (${res.status})`;
        addNotification({ type: 'error', title: 'Upload failed', message: msg });
        alert(msg);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error uploading images';
      addNotification({ type: 'error', title: 'Upload error', message: msg });
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGalleryUpdate(id: number) {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_jwt");
      const formData = new FormData();
      if (galleryEditForm.title !== undefined) formData.append('title', galleryEditForm.title);
      if (galleryEditForm.description !== undefined) formData.append('description', galleryEditForm.description);
      if (galleryEditForm.status) formData.append('status', galleryEditForm.status);
      if (galleryEditForm.display_order !== undefined) formData.append('display_order', String(galleryEditForm.display_order));

      const res = await fetch(getApiUrl(`api/gallery/${id}`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setGalleryEditId(null);
        setGalleryEditForm({});
        fetchGallery();
        addNotification({ type: 'success', title: 'Success', message: 'Gallery image updated!' });
      } else {
        alert('Failed to update gallery image');
      }
    } catch (error) {
      alert('Error updating gallery image');
    } finally {
      setLoading(false);
    }
  }

  async function handleGalleryDelete(id: number) {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/gallery/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchGallery();
        addNotification({ type: 'success', title: 'Success', message: 'Gallery image deleted!' });
      } else {
        alert('Failed to delete gallery image');
      }
    } catch (error) {
      alert('Error deleting gallery image');
    }
  }

  // CMS CRUD
  async function fetchCmsContent() {
    try {
      const token = localStorage.getItem("admin_jwt");
      const url = cmsPageFilter === 'all' ? 'api/cms' : `api/cms/${cmsPageFilter}`;
      const res = await fetch(getApiUrl(url), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.raw || [];
        setCmsContent(raw);
        if (raw.length === 0) {
          const seedRes = await fetch(getApiUrl('api/cms/seed'), {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (seedRes.ok) await fetchCmsContent();
        }
      }
    } catch (error) {
      console.error('Error fetching CMS content:', error);
    }
  }

  async function handleCmsPreload() {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl('api/cms/seed'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        fetchCmsContent();
        addNotification({ type: 'success', title: 'CMS preloaded', message: data.message || 'Current site content loaded.' });
      } else {
        addNotification({ type: 'error', title: 'Preload failed', message: data.error || 'Could not preload content.' });
      }
    } catch (error) {
      addNotification({ type: 'error', title: 'Preload failed', message: error instanceof Error ? error.message : 'Could not preload content.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleCmsSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!cmsForm.page_key || !cmsForm.section_key || !cmsForm.field_key) {
      alert('Page, Section, and Field Key are required');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl('api/cms'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cmsForm)
      });
      if (res.ok) {
        setCmsForm({ page_key: 'home', section_key: '', field_key: '', field_value: '', field_type: 'text' });
        setCmsEditId(null);
        setShowCmsModal(false);
        fetchCmsContent();
        addNotification({ type: 'success', title: 'Success', message: 'CMS content saved!' });
      } else {
        alert('Failed to save CMS content');
      }
    } catch (error) {
      alert('Error saving CMS content');
    } finally {
      setLoading(false);
    }
  }

  async function handleCmsDelete(id: number) {
    if (!confirm('Are you sure you want to delete this CMS entry?')) return;
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/cms/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCmsContent();
        addNotification({ type: 'success', title: 'Success', message: 'CMS content deleted!' });
      } else {
        alert('Failed to delete CMS content');
      }
    } catch (error) {
      alert('Error deleting CMS content');
    }
  }

  // Fetch gallery and CMS on menu change
  useEffect(() => {
    if (activeMenu === 'gallery') fetchGallery();
    if (activeMenu === 'cms') fetchCmsContent();
  }, [activeMenu, cmsPageFilter]);

  // Webinar form handlers
  async function handleWebinarSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_jwt");
      const method = webinarEditId ? "PUT" : "POST";
      const url = webinarEditId
        ? getApiUrl(`api/webinars/${webinarEditId}`)
        : getApiUrl("api/webinars");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(webinarForm),
      });

      if (res.ok) {
        setWebinarForm({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          duration_minutes: 60,
          max_attendees: 100,
          price: 0,
          is_free: true,
          attendee_emails: [],
          meeting_notes: '',
          status: 'scheduled'
        });
        setWebinarEditId(null);
        setShowWebinarModal(false);
        fetchWebinars();
        addNotification({
          type: 'success',
          title: 'Success',
          message: webinarEditId ? 'Webinar updated successfully!' : 'Webinar scheduled successfully!'
        });
      } else {
        const errorData = await res.text();
        alert(`Failed to save webinar: ${res.status} ${errorData}`);
      }
    } catch (error) {

      alert('Error saving webinar. Please try again.');
    }
  }

  async function handleWebinarEdit(webinar: Webinar) {
    setWebinarEditId(webinar.id ?? null);
    setWebinarForm(webinar);
    setShowWebinarModal(true);
  }

  async function handleWebinarDelete(webinarId: number) {
    if (!confirm('Are you sure you want to delete this webinar?')) return;

    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/webinars/${webinarId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setWebinars(webinars.filter(w => w.id !== webinarId));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Webinar deleted successfully!'
        });
      } else {
        alert('Failed to delete webinar');
      }
    } catch (error) {

      alert('Error deleting webinar');
    }
  }

  // Consultation form handlers
  async function handleConsultationSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_jwt");
      const method = consultationEditId ? "PUT" : "POST";
      const url = consultationEditId
        ? getApiUrl(`api/admin/consultations/${consultationEditId}`)
        : getApiUrl("api/admin/consultations");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(consultationForm),
      });

      if (res.ok) {
        setConsultationForm({
          consultant_id: 0,
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          duration_minutes: 60,
          meeting_type: 'consultation',
          price: 0,
          attendee_emails: [],
          notes: '',
          status: 'scheduled',
          payment_status: 'pending'
        });
        setConsultationEditId(null);
        setShowConsultationModal(false);
        fetchConsultations();
        alert(consultationEditId ? 'Consultation updated successfully!' : 'Consultation scheduled successfully!');
      } else {
        const errorData = await res.text();
        alert(`Failed to save consultation: ${res.status} ${errorData}`);
      }
    } catch (error) {

      alert('Error saving consultation. Please try again.');
    }
  }

  async function handleConsultationEdit(consultation: Consultation) {
    setConsultationEditId(consultation.id ?? null);
    setConsultationForm(consultation);
    setShowConsultationModal(true);
  }

  async function handleConsultationDelete(consultation: any) {
    const consultationId = consultation.id;
    if (!consultationId) {
      alert('Invalid consultation ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this consultation?')) return;

    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl(`api/admin/consultations/${consultationId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setConsultations(consultations.filter(c => c.id !== consultationId));
        alert('Consultation deleted successfully!');
      } else {
        alert('Failed to delete consultation');
      }
    } catch (error) {

      alert('Error deleting consultation');
    }
  }

  // Google OAuth setup handler
  async function handleGoogleOAuthSetup() {
    try {
      const token = localStorage.getItem("admin_jwt");
      const res = await fetch(getApiUrl("api/auth/admin/google"), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        window.open(data.authUrl, '_blank');
        setGoogleOAuthSetup(true);
        alert('Google OAuth setup initiated. Please complete the authorization in the popup window.');
      } else {
        alert('Failed to initiate Google OAuth setup');
      }
    } catch (error) {

      alert('Error setting up Google OAuth');
    }
  }

  const tableContextValue = {
    searchTerm,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    onSearch: handleSearch,
    onSort: handleSort,
    onPageChange: setCurrentPage,
  };

  const DataTable = DashboardDataTable;

  // Show loading state during hydration
  if (!isClient) {
      const tabProps: any = {
  DataTable,
  activeMenu,
  addNotification,
  ailmentsExpanded,
  blogEditId,
  coverPhotoFile,
  coverPhotoPreview,
  blogForm,
  blogs,
  catEditId,
  catName,
  categories,
  categoryRef,
  chartData,
  cityFilter,
  cmsContent,
  cmsEditId,
  cmsForm,
  cmsPageFilter,
  consultantAvailability,
  consultantEditId,
  consultantForm,
  consultantFormLoaded,
  consultantProfile,
  consultantSlots,
  consultants,
  consultationDate,
  consultationEditId,
  consultationForm,
  consultations,
  couponEditId,
  couponForm,
  coupons,
  currentPage,
  dashboardStats,
  deleteBlogId,
  deleteBlogName,
  deleteConsultantId,
  deleteConsultantName,
  deleteProductId,
  deleteProductName,
  fetchBlogs,
  fetchCategories,
  fetchCmsContent,
  fetchConsultants,
  fetchConsultations,
  fetchCoupons,
  fetchGallery,
  fetchOrders,
  fetchProducts,
  fetchServices,
  fetchSubcategories,
  
  plans, overrides,
  fetchUsers,
  fetchWebinars,
  filterAndSortData,
  formEmail,
  formLoading,
  formMessage,
  formName,
  formatDate,
  formatTime,
  galleryDescription,
  galleryEditForm,
  galleryEditId,
  galleryFiles,
  galleryImages,
  galleryPreview,
  galleryTitle,
  generateMeetLink,
  getApiUrl,
  getAvailableDates,
  getBlockedDates,
  getImageUrl,
  getGalleryImageUrl,
  getTimeSlotsForDate,
  getTotalPages,
  googleOAuthSetup,
  handleCoverPhotoChange,
  handleMediaImageChange,
  handleMediaVideoChange,
  handleAddSlot,
  handleAddSlotWithDuration,
  handleBlogDelete,
  handleBlogEdit,
  handleBlogSubmit,
  handleCatDelete,
  handleCatEdit,
  handleCatSubmit,
  handleCmsDelete,
  handleCmsPreload,
  handleCmsSave,
  handleConsultantDelete,
  handleConsultantEdit,
  handleConsultantFormCancel,
  handleConsultantFormChange,
  handleConsultantMultiSelect,
  handleConsultantProfile,
  handleConsultantSubmit,
  handleConsultationDelete,
  handleConsultationEdit,
  handleConsultationSubmit,
  handleCouponDelete,
  handleCouponSubmit,
  handlePlanDelete, handleOverrideDelete,
  handleEventImageChange,
  handleFileUpload,
  handleGalleryDelete,
  handleGalleryUpdate,
  handleGalleryUpload,
  handleGoogleOAuthSetup,
  handleLogout,
  handleQuickAddSlots,
  handleRemoveSlot,
  handleSearch,
  handleServiceDelete,
  handleServiceEdit,
  handleServiceFormChange,
  handleServiceProfile,
  handleServiceSubmit,
  handleSimpleFormSubmit,
  handleSlotChange,
  handleSort,
  handleSubDelete,
  handleSubEdit,
  handleSubSubmit,
  
  handleToggleApproval,
  handleToggleConsultantStatus,
  handleToggleUserStatus,
  handleToggleBlogStatus,
  handleUserDelete,
  handleUserEdit,
  handleUserSubmit,
  handleWebinarDelete,
  handleWebinarEdit,
  handleWebinarSubmit,
  showDeleteConsultantModal,
  isClient,
  isLoaded,
  lastUpdate,
  limit,
  loading,
  orders,
  paginateData,
  productEditId,
  productForm,
  products,
  recentOrders,
  router,
  saveConsultantSlots,
  searchTerm,
  selectedConsultantIds,
  serviceEditId,
  serviceForm,
  serviceFormLoading,
  serviceFormMessage,
  serviceProfile,
  services,
  setActiveMenu,
  setAilmentsExpanded,
  setBlogEditId,
  setBlogForm,
  setCoverPhotoFile,
  setCoverPhotoPreview,
  setBlogs,
  setCatEditId,
  setCatName,
  setCategories,
  setChartData,
  setCityFilter,
  setCmsContent,
  setCmsEditId,
  setCmsForm,
  setCmsPageFilter,
  setConsultantAvailability,
  setConsultantEditId,
  setConsultantForm,
  setConsultantFormLoaded,
  setConsultantProfile,
  setConsultantSlots,
  setConsultants,
  setConsultationDate,
  setConsultationEditId,
  setConsultationForm,
  setConsultations,
  setCouponEditId,
  setCouponForm,
  setCoupons,
  setCurrentPage,
  setDashboardStats,
  setDeleteBlogId,
  setDeleteBlogName,
  setDeleteConsultantId,
  setDeleteConsultantName,
  setDeleteProductId,
  setDeleteProductName,
  setFormEmail,
  setFormLoading,
  setFormMessage,
  setFormName,
  setGalleryDescription,
  setGalleryEditForm,
  setGalleryEditId,
  setGalleryFiles,
  setGalleryImages,
  setGalleryPreview,
  setGalleryTitle,
  setGoogleOAuthSetup,
  setMediaImageFiles,
  setMediaVideoFiles,
  setIsClient,
  setLastUpdate,
  setLoading,
  setOrders,
  setPage,
  setProductEditId,
  setProductForm,
  setProducts,
  setRecentOrders,
  setSearchTerm,
  setSelectedConsultantIds,
  setServiceEditId,
  setServiceForm,
  setServiceFormLoading,
  setServiceFormMessage,
  setServiceProfile,
  setServices,
  setShowBlogModal,
  setShowCategoryModal,
  setShowCmsModal,
  setShowConsultantModal,
  setShowConsultantProfileModal,
  setShowConsultationModal,
  setShowCouponModal,
  setShowDeleteModal,
  setShowGalleryModal,
  setShowProductModal,
  setShowProductProfileModal,
  setShowProfileModal,
  setShowServiceModal,
  setShowServiceProfileModal,
  setShowSubcategoryModal,
  setShowPlanModal, setShowOverrideModal,
  setShowSuccessPopup,
  setShowUserModal,
  setShowWebinarModal,
  setSidebarOpen,
  setSlotDuration,
  setSortDirection,
  setSortField,
  setStatusFilter,
  setSubCatId,
  setSubEditId,
  setSubName,
  setSubcategories,
  setPlanEditId, setOverrideEditId,
  setPlanForm, setOverrideForm,
  setPlans, setOverrides,
  setSuccessMessage,
  setTotalPages,
  setUserEditId,
  setUserForm,
  setUsers,
  setWebinarEditId,
  setWebinarForm,
  setWebinars,
  showBlogModal,
  showCategoryModal,
  showCmsModal,
  showConsultantModal,
  showConsultantProfileModal,
  showConsultationModal,
  showCouponModal,
  showDeleteModal,
  showGalleryModal,
  showProductModal,
  showProductProfileModal,
  showProfileModal,
  showServiceModal,
  showServiceProfileModal,
  showSubcategoryModal,
  showPlanModal, showOverrideModal,
  showSuccessPopup,
  showUserModal,
  showWebinarModal,
  sidebarOpen,
  slotDuration,
  sortDirection,
  sortField,
  statusFilter,
  subCatId,
  subEditId,
  subName,
  subcategories,
  planEditId, overrideEditId,
  planForm, overrideForm,
  successMessage,
  totalPages,
  userEditId,
  userForm,
  users,
  webinarEditId,
  webinarForm,
  webinars
, handleUseMyLocation, defaultMapCenter, handleMapClick, handleUserFormChange, Footer, GoogleMap, Marker,
  mediaImageFiles,
  mediaVideoFiles,
  resetBlogForm,
};

  return (
      <div className={styles.extractedStyle24}>
        <div className={styles.extractedStyle25}>
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  
  const tabProps: any = {
  DataTable,
  activeMenu,
  addNotification,
  ailmentsExpanded,
  blogEditId,
  coverPhotoFile,
  coverPhotoPreview,
  blogForm,
  blogs,
  catEditId,
  catName,
  categories,
  categoryRef,
  chartData,
  cityFilter,
  cmsContent,
  cmsEditId,
  cmsForm,
  cmsPageFilter,
  consultantAvailability,
  consultantEditId,
  consultantForm,
  consultantFormLoaded,
  consultantProfile,
  consultantSlots,
  consultants,
  consultationDate,
  consultationEditId,
  consultationForm,
  consultations,
  couponEditId,
  couponForm,
  coupons,
  currentPage,
  dashboardStats,
  deleteBlogId,
  deleteBlogName,
  deleteConsultantId,
  deleteConsultantName,
  deleteProductId,
  deleteProductName,
  fetchBlogs,
  fetchCategories,
  fetchCmsContent,
  fetchConsultants,
  fetchConsultations,
  fetchCoupons,
  fetchGallery,
  fetchOrders,
  fetchProducts,
  fetchServices,
  fetchSubcategories,
  
  plans, overrides,
  fetchUsers,
  fetchWebinars,
  filterAndSortData,
  formEmail,
  formLoading,
  formMessage,
  formName,
  formatDate,
  formatTime,
  galleryDescription,
  galleryEditForm,
  galleryEditId,
  galleryFiles,
  galleryImages,
  galleryPreview,
  galleryTitle,
  generateMeetLink,
  getApiUrl,
  getAvailableDates,
  getBlockedDates,
  getImageUrl,
  getGalleryImageUrl,
  getTimeSlotsForDate,
  getTotalPages,
  googleOAuthSetup,
  handleCoverPhotoChange,
  handleMediaImageChange,
  handleMediaVideoChange,
  handleAddSlot,
  handleAddSlotWithDuration,
  handleBlogDelete,
  handleBlogEdit,
  handleBlogSubmit,
  handleCatDelete,
  handleCatEdit,
  handleCatSubmit,
  handleCmsDelete,
  handleCmsPreload,
  handleCmsSave,
  handleConsultantDelete,
  handleConsultantEdit,
  handleConsultantFormCancel,
  handleConsultantFormChange,
  handleConsultantMultiSelect,
  handleConsultantProfile,
  handleConsultantSubmit,
  handleConsultationDelete,
  handleConsultationEdit,
  handleConsultationSubmit,
  handleCouponDelete,
  handleCouponSubmit,
  handlePlanDelete, handleOverrideDelete,
  handleEventImageChange,
  handleFileUpload,
  handleGalleryDelete,
  handleGalleryUpdate,
  handleGalleryUpload,
  handleGoogleOAuthSetup,
  handleLogout,
  handleQuickAddSlots,
  handleRemoveSlot,
  handleSearch,
  handleServiceDelete,
  handleServiceEdit,
  handleServiceFormChange,
  handleServiceProfile,
  handleServiceSubmit,
  handleSimpleFormSubmit,
  handleSlotChange,
  handleSort,
  handleSubDelete,
  handleSubEdit,
  handleSubSubmit,
  
  handleToggleApproval,
  handleToggleConsultantStatus,
  handleToggleUserStatus,
  handleToggleBlogStatus,
  handleUserDelete,
  handleUserEdit,
  handleUserSubmit,
  handleWebinarDelete,
  handleWebinarEdit,
  handleWebinarSubmit,
  showDeleteConsultantModal,
  isClient,
  isLoaded,
  lastUpdate,
  limit,
  loading,
  orders,
  paginateData,
  productEditId,
  productForm,
  products,
  recentOrders,
  router,
  saveConsultantSlots,
  searchTerm,
  selectedConsultantIds,
  serviceEditId,
  serviceForm,
  serviceFormLoading,
  serviceFormMessage,
  serviceProfile,
  services,
  setActiveMenu,
  setAilmentsExpanded,
  setBlogEditId,
  setBlogForm,
  setCoverPhotoFile,
  setCoverPhotoPreview,
  setBlogs,
  setCatEditId,
  setCatName,
  setCategories,
  setChartData,
  setCityFilter,
  setCmsContent,
  setCmsEditId,
  setCmsForm,
  setCmsPageFilter,
  setConsultantAvailability,
  setConsultantEditId,
  setConsultantForm,
  setConsultantFormLoaded,
  setConsultantProfile,
  setConsultantSlots,
  setConsultants,
  setConsultationDate,
  setConsultationEditId,
  setConsultationForm,
  setConsultations,
  setCouponEditId,
  setCouponForm,
  setCoupons,
  setCurrentPage,
  setDashboardStats,
  setDeleteBlogId,
  setDeleteBlogName,
  setDeleteConsultantId,
  setDeleteConsultantName,
  setDeleteProductId,
  setDeleteProductName,
  setFormEmail,
  setFormLoading,
  setFormMessage,
  setFormName,
  setGalleryDescription,
  setGalleryEditForm,
  setGalleryEditId,
  setGalleryFiles,
  setGalleryImages,
  setGalleryPreview,
  setGalleryTitle,
  setGoogleOAuthSetup,
  setMediaImageFiles,
  setMediaVideoFiles,
  setIsClient,
  setLastUpdate,
  setLoading,
  setOrders,
  setPage,
  setProductEditId,
  setProductForm,
  setProducts,
  setRecentOrders,
  setSearchTerm,
  setSelectedConsultantIds,
  setServiceEditId,
  setServiceForm,
  setServiceFormLoading,
  setServiceFormMessage,
  setServiceProfile,
  setServices,
  setShowBlogModal,
  setShowCategoryModal,
  setShowCmsModal,
  setShowConsultantModal,
  setShowConsultantProfileModal,
  setShowConsultationModal,
  setShowCouponModal,
  setShowDeleteModal,
  setShowGalleryModal,
  setShowProductModal,
  setShowProductProfileModal,
  setShowProfileModal,
  setShowServiceModal,
  setShowServiceProfileModal,
  setShowSubcategoryModal,
  setShowPlanModal, setShowOverrideModal,
  setShowSuccessPopup,
  setShowUserModal,
  setShowWebinarModal,
  setSidebarOpen,
  setSlotDuration,
  setSortDirection,
  setSortField,
  setStatusFilter,
  setSubCatId,
  setSubEditId,
  setSubName,
  setSubcategories,
  setPlanEditId, setOverrideEditId,
  setPlanForm, setOverrideForm,
  setPlans, setOverrides,
  setSuccessMessage,
  setTotalPages,
  setUserEditId,
  setUserForm,
  setUsers,
  setWebinarEditId,
  setWebinarForm,
  setWebinars,
  showBlogModal,
  showCategoryModal,
  showCmsModal,
  showConsultantModal,
  showConsultantProfileModal,
  showConsultationModal,
  showCouponModal,
  showDeleteModal,
  showGalleryModal,
  showProductModal,
  showProductProfileModal,
  showProfileModal,
  showServiceModal,
  showServiceProfileModal,
  showSubcategoryModal,
  showPlanModal, showOverrideModal,
  showSuccessPopup,
  showUserModal,
  showWebinarModal,
  sidebarOpen,
  slotDuration,
  sortDirection,
  sortField,
  statusFilter,
  subCatId,
  subEditId,
  subName,
  subcategories,
  planEditId, overrideEditId,
  planForm, overrideForm,
  successMessage,
  totalPages,
  userEditId,
  userForm,
  users,
  webinarEditId,
  webinarForm,
  webinars,
  mediaImageFiles,
  mediaVideoFiles,
  resetBlogForm,
  handleUseMyLocation, defaultMapCenter, handleMapClick, handleUserFormChange, Footer, GoogleMap, Marker};

  return (
    <div className={styles.extractedStyle26}>
      
      {/* Header */}
      <div className={styles.extractedStyle27}>
        <div className={styles.extractedStyle28}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className={styles.extractedStyle29}
            aria-label="Toggle sidebar"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <span className={styles.extractedStyle30}>MIET Admin Panel</span>
        </div>
        <div className={styles.extractedStyle31}>
          <button
            onClick={() => setShowProfileModal(true)}
            className={styles.extractedStyle32}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <FaUserCircle size={24} color="#fff" /> Profile
          </button>
          <button
            onClick={handleLogout}
            className={styles.extractedStyle33}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      {/* Profile Modal */}
      {showProfileModal && (
        <div className={styles.extractedStyle34} onClick={e => { if (e.target === e.currentTarget) setShowProfileModal(false); }}>
          <div className={styles.extractedStyle35}>
            <button onClick={() => setShowProfileModal(false)} aria-label="Close profile modal" className={styles.extractedStyle36}>×</button>
            <h2 className={styles.extractedStyle37}>Superadmin Profile</h2>
            <div className={styles.extractedStyle38}>Username: admin</div>
            <div className={styles.extractedStyle39}>Role: Superadmin</div>
            <div className={styles.extractedStyle40}>You are logged in as the superadmin.</div>
          </div>
        </div>
      )}
      {/* Main layout: sidebar + content */}
      <div className={styles.extractedStyle41}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 240 : 70,
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarOpen ? 'flex-start' : 'center',
          padding: sidebarOpen ? '32px 0 0 0' : '32px 0 0 0',
          minHeight: 'calc(100vh - 70px)',
          boxShadow: '4px 0 20px rgba(102, 126, 234, 0.15)',
          position: 'relative'
        }}>
          <div className={styles.extractedStyle42}>
            <div className={styles.extractedStyle43}>
              <Image src="/miet-main.webp" alt="MieT Logo" width={48} height={48} className={styles.extractedStyle44} priority />
            </div>
            {sidebarOpen && (
              <span className={styles.extractedStyle45}>MieT</span>
            )}
          </div>
          <nav className={styles.extractedStyle46}>
            {menu.map((item) => (
              'children' in item && Array.isArray(item.children) ? (
                <div key={item.key} className={styles.extractedStyle47}>
                  <button
                    onClick={() => {
                      // Toggle the ailments expansion
                      if (item.key === 'ailments') {
                        setAilmentsExpanded(!ailmentsExpanded);
                        // If expanding and no child is active, set the first child as active
                        if (!ailmentsExpanded && item.children && item.children.length > 0) {
                          setActiveMenu(item.children[0].key as typeof activeMenu);
                        }
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sidebarOpen ? 16 : 0,
                      width: '100%',
                      background: (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu) ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      borderRadius: sidebarOpen ? '0 12px 12px 0' : '0',
                      padding: sidebarOpen ? '16px 28px' : '16px 0',
                      fontWeight: 600,
                      fontSize: 16,
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      transition: 'all 0.2s ease',
                      margin: '4px 0',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    aria-label={item.label}
                    onMouseEnter={(e) => {
                      if (!((item.key === 'ailments' && ailmentsExpanded) || (item.children && item.children.some((c) => c.key === activeMenu)))) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!((item.key === 'ailments' && ailmentsExpanded) || (item.children && item.children.some((c) => c.key === activeMenu)))) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      background: (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu) ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.6)',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}>
                      {React.cloneElement(item.icon, { color: '#fff' })}
                    </div>
                    {sidebarOpen && <span className={styles.extractedStyle48}>{item.label}</span>}
                    {sidebarOpen && (
                      (item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu)
                        ? <FaChevronDown className={styles.extractedStyle49} />
                        : <FaChevronRight className={styles.extractedStyle50} />
                    )}
                  </button>
                  {sidebarOpen && item.children && ((item.key === 'ailments' && ailmentsExpanded) || item.children.some((c) => c.key === activeMenu)) && (
                    <div className={styles.extractedStyle51}>
                      {item.children!.map((child) => (
                        <button
                          key={child.key}
                          onClick={() => setActiveMenu(child.key as typeof activeMenu)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            width: '100%',
                            background: activeMenu === child.key ? 'rgba(255,255,255,0.15)' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0 8px 8px 0',
                            padding: '12px 24px',
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: 'pointer',
                            justifyContent: 'flex-start',
                            transition: 'all 0.2s ease',
                            margin: '2px 0',
                            position: 'relative'
                          }}
                          aria-label={child.label}
                          onMouseEnter={(e) => {
                            if (activeMenu !== child.key) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (activeMenu !== child.key) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            background: activeMenu === child.key ? 'rgba(102, 126, 234, 0.8)' : 'rgba(102, 126, 234, 0.4)',
                            borderRadius: '6px',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}>
                            {React.cloneElement(child.icon, { color: '#fff' })}
                          </div>
                          <span className={styles.extractedStyle52}>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key as typeof activeMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: sidebarOpen ? 16 : 0,
                    width: '100%',
                    background: activeMenu === item.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    borderRadius: sidebarOpen ? '0 12px 12px 0' : '0',
                    padding: sidebarOpen ? '16px 28px' : '16px 0',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    transition: 'all 0.2s ease',
                    margin: '4px 0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  aria-label={item.label}
                  onMouseEnter={(e) => {
                    if (activeMenu !== item.key) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== item.key) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    background: activeMenu === item.key ? 'rgba(102, 126, 234, 0.9)' : 'rgba(102, 126, 234, 0.6)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {React.cloneElement(item.icon, { color: '#fff' })}
                  </div>
                  {sidebarOpen && <span className={styles.extractedStyle53}>{item.label}</span>}
                </button>
              )
            ))}
          </nav>
        </aside>
        {/* Main content */}
        <AdminTableContext.Provider value={tableContextValue}>
        <main className={styles.extractedStyle54}>
          {/* Dashboard view with charts/tables */}
          {activeMenu === 'dashboard' && (
  <DashboardTab {...tabProps} />
)}
          {/* Categories CRUD */}
          {activeMenu === 'categories' && (
            <CategoriesTab
              categories={categories}
              setCatEditId={setCatEditId}
              setCatName={setCatName}
              setShowCategoryModal={setShowCategoryModal}
              handleCatDelete={handleCatDelete}
              DataTable={DataTable}
            />
          )}

          {/* Subcategories CRUD */}
          {activeMenu === 'subcategories' && (
  <SubcategoriesTab {...tabProps} />
)}








          {/* Consultants CRUD */}
          {activeMenu === 'consultants' && (
  <ConsultantsTab {...tabProps} />
)}












          
        {/* Consultant Modal */}
        {showConsultantProfileModal && consultantProfile && (
          <div className={styles.extractedStyle55} onClick={e => { if (e.target === e.currentTarget) setShowConsultantProfileModal(false); }}>
            <div className={styles.extractedStyle56}>
              <button 
                onClick={() => setShowConsultantProfileModal(false)}
                className={styles.extractedStyle57}
              >
                &times;
              </button>
              <h2 className={styles.extractedStyle58}>{consultantProfile.name}&apos;s Profile</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {consultantProfile.image && (
                  <div>
                    <img 
                      src={getImageUrl(consultantProfile.image)} 
                      alt={consultantProfile.name} 
                      style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} 
                    />
                  </div>
                )}
                {consultantProfile.id_proof_url && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 8, padding: 16 }}>
                    <a 
                      href={getImageUrl(consultantProfile.id_proof_url)} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}
                    >
                      View ID Proof
                    </a>
                  </div>
                )}
              </div>

              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 24, fontSize: '14px', color: '#334155' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Username:</strong> {consultantProfile.username}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Email:</strong> {consultantProfile.email}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Phone:</strong> {consultantProfile.phone}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Location:</strong> {consultantProfile.city}, {consultantProfile.country}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Current Status:</strong> <span style={{ color: consultantProfile.approval_status === 'approved' ? 'green' : 'orange' }}>{consultantProfile.approval_status || 'Pending'}</span></p>
                <p style={{ margin: '0' }}><strong>Aadhar:</strong> {consultantProfile.aadhar}</p>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <button 
                  onClick={async () => {
                    if (!confirm('Are you sure you want to approve this consultant?')) return;
                    try {
                      const res = await fetch(getApiUrl(`api/consultants/${consultantProfile.id}/approve`), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` },
                        body: JSON.stringify({ status: 'approved' })
                      });
                      if(res.ok) {
                        alert('Consultant approved successfully');
                        setShowConsultantProfileModal(false);
                      } else {
                        alert('Failed to approve');
                      }
                    } catch (e) { console.error(e); }
                  }}
                  style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button 
                  onClick={async () => {
                    const reason = window.prompt('Please enter a rejection reason:');
                    if (reason === null) return;
                    try {
                      const res = await fetch(getApiUrl(`api/consultants/${consultantProfile.id}/approve`), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` },
                        body: JSON.stringify({ status: 'rejected', reason: reason })
                      });
                      if(res.ok) {
                        alert('Consultant rejected');
                        setShowConsultantProfileModal(false);
                      } else {
                        alert('Failed to reject');
                      }
                    } catch (e) { console.error(e); }
                  }}
                  style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

          {showConsultantModal && (
            <div className={styles.extractedStyle55} onClick={e => { if (e.target === e.currentTarget) setShowConsultantModal(false); }}>
              <div className={styles.extractedStyle56}>
                <button
                  onClick={() => setShowConsultantModal(false)}
                  aria-label="Close consultant modal"
                  className={styles.extractedStyle57}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  ×
                </button>

                <h2 className={styles.extractedStyle58}>{consultantEditId ? 'Edit' : 'Add'} Consultant</h2>

                <form id="consultant-form" onSubmit={handleConsultantSubmit} className={styles.extractedStyle59}>
                  {/* Left Column */}
                  <div className={styles.extractedStyle60}>
                    <div className={styles.extractedStyle61}>
                      <div className={styles.extractedStyle62}>
                        <label className={styles.extractedStyle63}>Username</label>
                        <input
                          name="username"
                          value={consultantForm.username || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Username"
                          required
                          className={styles.extractedStyle64}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div className={styles.extractedStyle65}>
                        <label className={styles.extractedStyle66}>
                          Password {consultantEditId ? '(Leave blank to keep current)' : '*'}
                        </label>
                        <input
                          name="password"
                          type="password"
                          value={consultantForm.password || ''}
                          onChange={handleConsultantFormChange}
                          placeholder={consultantEditId ? "New password (optional)" : "Password"}
                          required={!consultantEditId}
                          className={styles.extractedStyle67}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                    </div>

                    {!consultantEditId && (
                      <div className={styles.extractedStyle68}>
                        <div className={styles.extractedStyle69}>
                          <label className={styles.extractedStyle70}>Confirm Password</label>
                          <input
                            name="confirmPassword"
                            type="password"
                            value={consultantForm.confirmPassword || ''}
                            onChange={handleConsultantFormChange}
                            placeholder="Confirm Password"
                            required
                            className={styles.extractedStyle71}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                          />
                        </div>
                      </div>
                    )}

                    <div className={styles.extractedStyle72}>
                      <div className={styles.extractedStyle73}>
                        <label className={styles.extractedStyle74}>Name</label>
                        <input
                          name="name"
                          value={consultantForm.name || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Name"
                          required
                          className={styles.extractedStyle75}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div className={styles.extractedStyle76}>
                        <label className={styles.extractedStyle77}>Gmail Address *</label>
                        <input
                          name="email"
                          type="email"
                          value={consultantForm.email || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="consultant@gmail.com"
                          required
                          pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                          title="Please enter a valid Gmail address"
                          className={styles.extractedStyle78}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                        <small className={styles.extractedStyle79}>
                          Gmail address is required for Google Meet invitations and calendar integration
                        </small>
                      </div>
                    </div>

                    <div className={styles.extractedStyle80}>
                      <div className={styles.extractedStyle81}>
                        <label className={styles.extractedStyle82}>Phone</label>
                        <input
                          name="phone"
                          value={consultantForm.phone || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Phone"
                          className={styles.extractedStyle83}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div className={styles.extractedStyle84}>
                        <label className={styles.extractedStyle85}>Tagline</label>
                        <input
                          name="tagline"
                          value={consultantForm.tagline || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Tagline"
                          className={styles.extractedStyle86}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={styles.extractedStyle87}>Speciality</label>
                      <input
                        name="speciality"
                        value={consultantForm.speciality || ''}
                        onChange={handleConsultantFormChange}
                        placeholder="Speciality"
                        className={styles.extractedStyle88}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      />
                    </div>

                    <div className={styles.extractedStyle89}>
                      <div className={styles.extractedStyle90}>
                        <label className={styles.extractedStyle91}>City</label>
                        <input
                          name="city"
                          value={consultantForm.city || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="City (e.g., Delhi)"
                          required
                          className={styles.extractedStyle92}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div className={styles.extractedStyle93}>
                        <label className={styles.extractedStyle94}>Address</label>
                        <input
                          name="address"
                          value={consultantForm.address || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Full Address (e.g., 123 Main St, Delhi, 110001)"
                          className={styles.extractedStyle95}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={styles.extractedStyle96}>Description</label>
                      <textarea
                        name="description"
                        value={consultantForm.description || ''}
                        onChange={handleConsultantFormChange}
                        placeholder="Description"
                        className={styles.extractedStyle97}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                      />
                    </div>

                    <div className={styles.extractedStyle98}>
                      <div className={styles.extractedStyle99}>
                        <label className={styles.extractedStyle100}>Aadhar</label>
                        <input
                          name="aadhar"
                          value={consultantForm.aadhar || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Aadhar"
                          className={styles.extractedStyle101}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div className={styles.extractedStyle102}>
                        <label className={styles.extractedStyle103}>Bank Account</label>
                        <input
                          name="bank_account"
                          value={consultantForm.bank_account || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Bank Account"
                          className={styles.extractedStyle104}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                      <div className={styles.extractedStyle105}>
                        <label className={styles.extractedStyle106}>Bank IFSC</label>
                        <input
                          name="bank_ifsc"
                          value={consultantForm.bank_ifsc || ''}
                          onChange={handleConsultantFormChange}
                          placeholder="Bank IFSC"
                          className={styles.extractedStyle107}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        />
                      </div>
                    </div>

                    <div className={styles.extractedStyle108}>
                      <div className={styles.extractedStyle109}>
                        <label className={styles.extractedStyle110}>Status</label>
                        <label className={styles.extractedStyle111}>
                          <input
                            type="checkbox"
                            name="status"
                            checked={consultantForm.status === 'online'}
                            onChange={e => setConsultantForm(f => ({ ...f, status: e.target.checked ? 'online' : 'offline' }))}
                            className={styles.extractedStyle112}
                          />
                          <span style={{ color: consultantForm.status === 'online' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                            {consultantForm.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </label>
                      </div>
                      <div className={styles.extractedStyle113}>
                        <label className={styles.extractedStyle114}>Featured</label>
                        <label className={styles.extractedStyle115}>
                          <input
                            type="checkbox"
                            name="featured"
                            checked={consultantForm.featured || false}
                            onChange={e => setConsultantForm(f => ({ ...f, featured: e.target.checked }))}
                            className={styles.extractedStyle116}
                          />
                          <span style={{ color: consultantForm.featured ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                            {consultantForm.featured ? 'Featured' : 'Not Featured'}
                          </span>
                        </label>
                      </div>
                      {/* Promote to Pro */}
                      <div className={styles.extractedStyle117}>
                        <label className={styles.extractedStyle118}>⭐ Pro Status</label>
                        <div className={styles.extractedStyle119}>
                          <label className={styles.extractedStyle120}>
                            <input
                              type="checkbox"
                              checked={(consultantForm as any).is_pro || false}
                              onChange={async (e) => {
                                const isPro = e.target.checked;
                                setConsultantForm(f => ({ ...f, is_pro: isPro } as any));
                                if ((consultantForm as any).id) {
                                  try {
                                    const token = localStorage.getItem('admin_jwt');
                                    await fetch(getApiUrl(`api/consultants/${(consultantForm as any).id}/promote`), {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                      body: JSON.stringify({ is_pro: isPro, subscription_plan: isPro ? 'premium' : null })
                                    });
                                  } catch (err) {
                                    console.error('Error promoting consultant:', err);
                                  }
                                }
                              }}
                              className={styles.extractedStyle121}
                            />
                            <span style={{ color: (consultantForm as any).is_pro ? '#d97706' : '#6b7280', fontWeight: 600 }}>
                              {(consultantForm as any).is_pro ? '⭐ Pro Consultant' : 'Standard'}
                            </span>
                          </label>
                          {(consultantForm as any).is_pro && (
                            <select
                              value={(consultantForm as any).subscription_plan || 'premium'}
                              onChange={(e) => setConsultantForm(f => ({ ...f, subscription_plan: e.target.value } as any))}
                              className={styles.extractedStyle122}
                            >
                              <option value="basic">Basic Plan</option>
                              <option value="standard">Standard Plan</option>
                              <option value="premium">Premium Plan</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.extractedStyle123}>
                      <div className={styles.extractedStyle124}>
                        <label className={styles.extractedStyle125}>Categories</label>
                        <select
                          multiple
                          value={Array.isArray(consultantForm.category_ids) ? consultantForm.category_ids.map(id => String(id)) : []}
                          onChange={e => handleConsultantMultiSelect('category_ids', Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                          className={styles.extractedStyle126}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.extractedStyle127}>
                        <label className={styles.extractedStyle128}>Subcategories</label>
                        <select
                          multiple
                          value={Array.isArray(consultantForm.subcategory_ids) ? consultantForm.subcategory_ids.map(id => String(id)) : []}
                          onChange={e => handleConsultantMultiSelect('subcategory_ids', Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                          className={styles.extractedStyle129}
                          onFocus={(e) => e.target.style.borderColor = '#667eea'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                        >
                          {subcategories
                            .filter(s => {
                              if (!Array.isArray(consultantForm.category_ids)) return false;
                              return consultantForm.category_ids.map(Number).includes(Number(s.category_id));
                            })
                            .map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className={styles.extractedStyle130}>
                    {/* Appointment Calendar Section */}
                    <div>
                      <label className={styles.extractedStyle131}>Appointment Calendar</label>
                      <div className={styles.extractedStyle132}>

                        {/* Duration Selector */}
                        <div className={styles.extractedStyle133}>
                          <label className={styles.extractedStyle134}>Slot Duration</label>
                          <div className={styles.extractedStyle135}>
                            {[
                              { value: 30, label: '30 min' },
                              { value: 45, label: '45 min' },
                              { value: 60, label: '1 hour' },
                              { value: 90, label: '1.5 hours' },
                              { value: 120, label: '2 hours' }
                            ].map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setSlotDuration(option.value)}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  border: slotDuration === option.value ? '2px solid #667eea' : '1px solid #ddd',
                                  background: slotDuration === option.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
                                  color: slotDuration === option.value ? '#fff' : '#374151',
                                  fontWeight: 600,
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                          <div className={styles.extractedStyle136}>
                            End time will be auto-calculated based on selected duration
                          </div>
                        </div>

                        {/* Quick Add Slots */}
                        <div className={styles.extractedStyle137}>
                          <label className={styles.extractedStyle138}>Quick Add Slots</label>
                          <div className={styles.extractedStyle139}>
                            <div>
                              <label className={styles.extractedStyle140}>Select Date</label>
                              <input
                                type="date"
                                id="quickAddDate"
                                min={new Date().toISOString().split('T')[0]}
                                className={styles.extractedStyle141}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const dateInput = document.getElementById('quickAddDate') as HTMLInputElement;
                                if (dateInput?.value) handleQuickAddSlots(dateInput.value, 'morning');
                              }}
                              className={styles.extractedStyle142}
                            >
                              🌅 Morning
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const dateInput = document.getElementById('quickAddDate') as HTMLInputElement;
                                if (dateInput?.value) handleQuickAddSlots(dateInput.value, 'afternoon');
                              }}
                              className={styles.extractedStyle143}
                            >
                              ☀️ Afternoon
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const dateInput = document.getElementById('quickAddDate') as HTMLInputElement;
                                if (dateInput?.value) handleQuickAddSlots(dateInput.value, 'evening');
                              }}
                              className={styles.extractedStyle144}
                            >
                              🌙 Evening
                            </button>
                          </div>
                          <div className={styles.extractedStyle145}>
                            Click a period to add all slots for that time range (6-12 AM, 12-5 PM, 5-9 PM)
                          </div>
                        </div>

                        {/* Existing Slots List */}
                        <div className={styles.extractedStyle146}>
                          <label className={styles.extractedStyle147}>
                            Available Time Slots ({consultantSlots.length})
                          </label>
                          {consultantSlots.length === 0 && <div className={styles.extractedStyle148}>No slots added yet. Use Quick Add or Add Time Slot below.</div>}

                          {/* Group slots by date */}
                          {(() => {
                            const slotsByDate = consultantSlots.reduce((acc, slot, idx) => {
                              if (!acc[slot.date]) acc[slot.date] = [];
                              acc[slot.date].push({ ...slot, idx });
                              return acc;
                            }, {} as { [date: string]: (typeof consultantSlots[0] & { idx: number })[] });

                            return Object.entries(slotsByDate)
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([date, slots]) => (
                                <div key={date} className={styles.extractedStyle149}>
                                  <div className={styles.extractedStyle150}>
                                    {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                                  </div>
                                  <div className={styles.extractedStyle151}>
                                    {slots.map((slot: any) => (
                                      <div key={slot.idx} className={styles.extractedStyle152}>
                                        <span className={styles.extractedStyle153}>{slot.time} - {slot.endTime || '?'}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveSlot(slot.idx)}
                                          className={styles.extractedStyle154}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ));
                          })()}

                          {/* Manual Add Slot */}
                          <div className={styles.extractedStyle155}>
                            <div className={styles.extractedStyle156}>Add Individual Slot</div>
                            <div className={styles.extractedStyle157}>
                              <div>
                                <label className={styles.extractedStyle158}>Date</label>
                                <input
                                  type="date"
                                  id="manualSlotDate"
                                  min={new Date().toISOString().split('T')[0]}
                                  className={styles.extractedStyle159}
                                />
                              </div>
                              <div>
                                <label className={styles.extractedStyle160}>Start Time</label>
                                <input
                                  type="time"
                                  id="manualSlotTime"
                                  className={styles.extractedStyle161}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const dateInput = document.getElementById('manualSlotDate') as HTMLInputElement;
                                  const timeInput = document.getElementById('manualSlotTime') as HTMLInputElement;
                                  if (dateInput?.value && timeInput?.value) {
                                    handleAddSlotWithDuration(dateInput.value, timeInput.value);
                                    timeInput.value = '';
                                  }
                                }}
                                className={styles.extractedStyle162}
                              >
                                Add Slot
                              </button>
                            </div>
                            <div className={styles.extractedStyle163}>
                              End time: auto-calculated ({slotDuration} min duration)
                            </div>
                          </div>
                        </div>
                        <div className={styles.extractedStyle164}>
                          Slots are organized by date. Past dates cannot be selected.
                        </div>
                      </div>
                    </div>

                    {/* Map Section */}
                    <div>
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        className={styles.extractedStyle165}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Use My Location
                      </button>
                      <label className={styles.extractedStyle166}>Location (select on map)</label>
                      <div className={styles.extractedStyle167}>
                        {isLoaded && (
                          <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={{
                              lat: consultantForm.location_lat ? parseFloat(consultantForm.location_lat) : defaultMapCenter.lat,
                              lng: consultantForm.location_lng ? parseFloat(consultantForm.location_lng) : defaultMapCenter.lng,
                            }}
                            zoom={consultantForm.location_lat && consultantForm.location_lng ? 13 : 5}
                            onClick={handleMapClick}
                          >
                            {consultantForm.location_lat && consultantForm.location_lng && (
                              <Marker
                                position={{ lat: parseFloat(consultantForm.location_lat), lng: parseFloat(consultantForm.location_lng) }}
                                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                              />
                            )}
                          </GoogleMap>
                        )}
                      </div>
                      <div className={styles.extractedStyle168}>
                        Lat: {consultantForm.location_lat || '-'}<br />Lng: {consultantForm.location_lng || '-'}
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div>
                      <label className={styles.extractedStyle169}>Consultant Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'image')}
                        className={styles.extractedStyle170}
                      />
                      {consultantForm.image && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantForm.image}`}
                          alt="Consultant"
                          width={80}
                          height={80}
                          className={styles.extractedStyle171}
                          unoptimized
                        />
                      )}
                    </div>

                    <div>
                      <label className={styles.extractedStyle172}>ID Proof (upload)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => handleFileUpload(e, 'id_proof_url')}
                        className={styles.extractedStyle173}
                      />
                      {consultantForm.id_proof_url && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${consultantForm.id_proof_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.extractedStyle174}
                        >
                          View Uploaded Document
                        </a>
                      )}
                    </div>
                  </div>
                </form>

                <div className={styles.extractedStyle175}>
                  <button
                    type="button"
                    onClick={() => handleConsultantSubmit()}
                    className={styles.extractedStyle176}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {consultantEditId ? 'Update' : 'Add'} Consultant
                  </button>
                  {consultantEditId && (
                    <button
                      type="button"
                      onClick={handleConsultantFormCancel}
                      className={styles.extractedStyle177}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Users CRUD */}
          {activeMenu === 'users' && (
  <UsersTab {...tabProps} />
)}
          {/* Services CRUD */}
          {activeMenu === 'services' && (
  <ServicesTab {...tabProps} />
)}













          {/* Products CRUD */}
          {activeMenu === 'products' && (
  <ProductsTab {...tabProps} />
)}



          {/* ================= SUBSCRIPTIONS ================= */}
          {activeMenu === 'subscriptions' && (
  <SubscriptionsTab {...tabProps} />
)}

          {/* ================= COUPONS ================= */}
          {activeMenu === 'coupons' && (
  <CouponsTab {...tabProps} />
)}

















          {activeMenu === 'orders' && (
  <OrdersTab {...tabProps} />
)}










          {/* Blogs CRUD */}
          {activeMenu === 'blogs' && (
  <BlogsTab {...tabProps} />
)}

          {/* Webinars CRUD */}
          {activeMenu === 'webinars' && (
  <WebinarsTab {...tabProps} />
)}

          {/* Consultations CRUD */}
          {activeMenu === 'consultations' && (
  <ConsultationsTab {...tabProps} />
)}

          {/* Gallery Management */}
          {activeMenu === 'gallery' && (
  <GalleryTab {...tabProps} />
)}

          {/* CMS / Page Content Management */}
          {activeMenu === 'cms' && (
  <CmsTab {...tabProps} />
)}



        </main>
        </AdminTableContext.Provider>
      </div>
      {/* Category Modal */}
      {showCategoryModal && (
        <div className={styles.extractedStyle178} onClick={e => { if (e.target === e.currentTarget) setShowCategoryModal(false); }}>
          <div className={styles.extractedStyle179}>
            <button
              onClick={() => setShowCategoryModal(false)}
              aria-label="Close category modal"
              className={styles.extractedStyle180}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 className={styles.extractedStyle181}>{catEditId ? 'Edit' : 'Add'} Category</h2>

            <form onSubmit={handleCatSubmit} className={styles.extractedStyle182}>
              <div>
                <label className={styles.extractedStyle183}>Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="Enter category name"
                  required
                  className={styles.extractedStyle184}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>

              <div className={styles.extractedStyle185}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {loading ? 'Saving...' : (catEditId ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className={styles.extractedStyle186}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className={styles.extractedStyle187} onClick={e => { if (e.target === e.currentTarget) setShowSubcategoryModal(false); }}>
          <div className={styles.extractedStyle188}>
            <button
              onClick={() => setShowSubcategoryModal(false)}
              aria-label="Close subcategory modal"
              className={styles.extractedStyle189}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 className={styles.extractedStyle190}>{subEditId ? 'Edit' : 'Add'} Subcategory</h2>

            <form onSubmit={handleSubSubmit} className={styles.extractedStyle191}>
              <div>
                <label className={styles.extractedStyle192}>Subcategory Name</label>
                <input
                  type="text"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  placeholder="Enter subcategory name"
                  required
                  className={styles.extractedStyle193}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>

              <div>
                <label className={styles.extractedStyle194}>Category</label>
                <select
                  value={subCatId}
                  onChange={e => setSubCatId(Number(e.target.value))}
                  required
                  className={styles.extractedStyle195}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.extractedStyle196}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {loading ? 'Saving...' : (subEditId ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubcategoryModal(false)}
                  className={styles.extractedStyle197}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Footer */}
      <Footer />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className={styles.extractedStyle210}>
          <div className={styles.extractedStyle211}>
            <span className={styles.extractedStyle212}>✅</span>
            <span>{successMessage}</span>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className={styles.extractedStyle213}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.extractedStyle214}>
          <div className={styles.extractedStyle215}>
            <h3 className={styles.extractedStyle216}>
              Delete {deleteBlogId ? 'Blog' : deleteConsultantId ? 'Consultant' : 'Product'}
            </h3>
            <p className={styles.extractedStyle217}>
              Are you sure you want to delete <strong>{deleteBlogId ? deleteBlogName : deleteConsultantId ? deleteConsultantName : deleteProductName}</strong>? This action cannot be undone.
            </p>
            <div className={styles.extractedStyle218}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConsultantId(null);
                  setDeleteConsultantName('');
                  setDeleteBlogId(null);
                  setDeleteBlogName('');
                  setDeleteProductId(null);
                  setDeleteProductName('');
                }}
                className={styles.extractedStyle219}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteBlogId) {
                    await handleBlogDelete();
                  } else if (deleteConsultantId) {
                    await handleConsultantDelete();
                  } else if (deleteProductId) {
                    try {
                      const response = await fetch(getApiUrl(`api/products/${deleteProductId}`), {
                        method: 'DELETE'
                      });

                      if (response.ok) {
                        setProducts(products.filter(p => p.id !== deleteProductId));
                        setSuccessMessage('Product deleted successfully!');
                        setShowSuccessPopup(true);
                      } else {
                        setProducts(products.filter(p => p.id !== deleteProductId));
                        setSuccessMessage('Product removed from view (backend delete not implemented)');
                        setShowSuccessPopup(true);
                      }
                    } catch (error) {
                      setProducts(products.filter(p => p.id !== deleteProductId));
                      setSuccessMessage('Product removed from view (backend delete not implemented)');
                      setShowSuccessPopup(true);
                    }
                  }
                  setShowDeleteModal(false);
                }}
                className={styles.extractedStyle220}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ========= SUBSCRIPTION MODAL ========= */}
      {showPlanModal && (
        <div className={styles.extractedStyle178} onClick={e => { if (e.target === e.currentTarget) setShowPlanModal(false); }}>
          <div className={styles.extractedStyle179}>
            <button
              onClick={() => setShowPlanModal(false)}
              aria-label="Close modal"
              className={styles.extractedStyle180}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 className={styles.extractedStyle181}>{planEditId ? "Edit Plan" : "Add Plan"}</h2>
            <form onSubmit={handlePlanSubmit} className={styles.extractedStyle182}>
              <div>
                <label className={styles.extractedStyle183}>Plan Key</label>
                <input 
                  placeholder="e.g. basic" 
                  className={styles.extractedStyle184} 
                  value={planForm.plan_key} 
                  onChange={(e)=>setPlanForm({...planForm,plan_key:e.target.value})} 
                  required
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>
              <div>
                <label className={styles.extractedStyle183}>Plan Name</label>
                <input 
                  placeholder="Plan Name" 
                  className={styles.extractedStyle184} 
                  value={planForm.plan_name} 
                  onChange={(e)=>setPlanForm({...planForm,plan_name:e.target.value})} 
                  required
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>
              <div>
                <label className={styles.extractedStyle183}>Billing Cycle</label>
                <select 
                  className={styles.extractedStyle184} 
                  value={planForm.billing_cycle} 
                  onChange={(e)=>setPlanForm({...planForm,billing_cycle:e.target.value})}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Base Price</label>
                  <input 
                    type="number" 
                    placeholder="Base Price" 
                    className={styles.extractedStyle184} 
                    value={planForm.base_price} 
                    onChange={(e)=>setPlanForm({...planForm,base_price:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Currency</label>
                  <input 
                    placeholder="e.g. INR" 
                    className={styles.extractedStyle184} 
                    value={planForm.currency} 
                    onChange={(e)=>setPlanForm({...planForm,currency:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
              </div>
              <div>
                <label className={styles.extractedStyle183}>Description</label>
                <textarea 
                  placeholder="Description" 
                  className={styles.extractedStyle184} 
                  value={planForm.description} 
                  onChange={(e)=>setPlanForm({...planForm,description:e.target.value})}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  style={{ minHeight: '100px', resize: 'vertical' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="planIsActive"
                  checked={planForm.is_active} 
                  onChange={(e)=>setPlanForm({...planForm,is_active:e.target.checked})} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#667eea' }}
                />
                <label htmlFor="planIsActive" className={styles.extractedStyle183} style={{ marginBottom: 0, cursor: 'pointer' }}>Is Active</label>
              </div>
              <div className={styles.extractedStyle185} style={{ gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={()=>setShowPlanModal(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                >Cancel</button>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========= OVERRIDE MODAL ========= */}
      {showOverrideModal && (
        <div className={styles.extractedStyle178} onClick={e => { if (e.target === e.currentTarget) setShowOverrideModal(false); }}>
          <div className={styles.extractedStyle179}>
            <button
              onClick={() => setShowOverrideModal(false)}
              aria-label="Close modal"
              className={styles.extractedStyle180}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 className={styles.extractedStyle181}>{overrideEditId ? "Edit Override" : "Add Override"}</h2>
            <form onSubmit={handleOverrideSubmit} className={styles.extractedStyle182}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>User ID</label>
                  <input 
                    type="text" 
                    placeholder="User ID" 
                    className={styles.extractedStyle184} 
                    value={overrideForm.user_id} 
                    onChange={(e)=>setOverrideForm({...overrideForm,user_id:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Plan Key</label>
                  <input 
                    placeholder="Plan Key" 
                    className={styles.extractedStyle184} 
                    value={overrideForm.plan_key} 
                    onChange={(e)=>setOverrideForm({...overrideForm,plan_key:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Billing Cycle</label>
                  <select 
                    className={styles.extractedStyle184} 
                    value={overrideForm.billing_cycle} 
                    onChange={(e)=>setOverrideForm({...overrideForm,billing_cycle:e.target.value})}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Override Price</label>
                  <input 
                    type="number" 
                    placeholder="Override Price" 
                    className={styles.extractedStyle184} 
                    value={overrideForm.override_price} 
                    onChange={(e)=>setOverrideForm({...overrideForm,override_price:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
              </div>
              <div>
                <label className={styles.extractedStyle183}>Reason</label>
                <input 
                  placeholder="Reason" 
                  className={styles.extractedStyle184} 
                  value={overrideForm.reason} 
                  onChange={(e)=>setOverrideForm({...overrideForm,reason:e.target.value})} 
                  required
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Starts At</label>
                  <input 
                    type="date" 
                    className={styles.extractedStyle184} 
                    value={overrideForm.starts_at} 
                    onChange={(e)=>setOverrideForm({...overrideForm,starts_at:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Ends At</label>
                  <input 
                    type="date" 
                    className={styles.extractedStyle184} 
                    value={overrideForm.ends_at} 
                    onChange={(e)=>setOverrideForm({...overrideForm,ends_at:e.target.value})} 
                    required
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="overrideIsActive"
                  checked={overrideForm.is_active} 
                  onChange={(e)=>setOverrideForm({...overrideForm,is_active:e.target.checked})} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#667eea' }}
                />
                <label htmlFor="overrideIsActive" className={styles.extractedStyle183} style={{ marginBottom: 0, cursor: 'pointer' }}>Is Active</label>
              </div>
              <div className={styles.extractedStyle185} style={{ gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={()=>setShowOverrideModal(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                >Cancel</button>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========= COUPON MODAL ========= */}
      {showCouponModal && (
        <div className={styles.extractedStyle178} onClick={e => { if (e.target === e.currentTarget) setShowCouponModal(false); }}>
          <div className={styles.extractedStyle179}>
            <button
              onClick={() => setShowCouponModal(false)}
              aria-label="Close modal"
              className={styles.extractedStyle180}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              ×
            </button>
            <h2 className={styles.extractedStyle181}>{couponEditId ? "Edit Coupon" : "Add Coupon"}</h2>
                        <form onSubmit={handleCouponSubmit} className={styles.extractedStyle182}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Code (e.g. NEW50)</label>
                  <input placeholder="Code" className={styles.extractedStyle184} value={couponForm.code} onChange={(e)=>setCouponForm({...couponForm,code:e.target.value})} required onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Title</label>
                  <input placeholder="Title" className={styles.extractedStyle184} value={couponForm.title} onChange={(e)=>setCouponForm({...couponForm,title:e.target.value})} required onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
              </div>
              <div>
                <label className={styles.extractedStyle183}>Description</label>
                <textarea placeholder="Description" className={styles.extractedStyle184} value={couponForm.description} onChange={(e)=>setCouponForm({...couponForm,description:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Discount Type</label>
                  <select className={styles.extractedStyle184} value={couponForm.discount_type} onChange={(e)=>setCouponForm({...couponForm,discount_type:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}>
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Discount Value</label>
                  <input type="number" placeholder="Discount Value" className={styles.extractedStyle184} value={couponForm.discount_value} onChange={(e)=>setCouponForm({...couponForm,discount_value:e.target.value})} required onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Min Order Amount</label>
                  <input type="number" placeholder="Min Amount" className={styles.extractedStyle184} value={couponForm.minimum_amount} onChange={(e)=>setCouponForm({...couponForm,minimum_amount:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Max Discount</label>
                  <input type="number" placeholder="Max Discount" className={styles.extractedStyle184} value={couponForm.maximum_discount} onChange={(e)=>setCouponForm({...couponForm,maximum_discount:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Applicable Plan Key</label>
                  <input placeholder="Plan Key" className={styles.extractedStyle184} value={couponForm.applicable_plan_key} onChange={(e)=>setCouponForm({...couponForm,applicable_plan_key:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Billing Cycle</label>
                  <select className={styles.extractedStyle184} value={couponForm.billing_cycle} onChange={(e)=>setCouponForm({...couponForm,billing_cycle:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'}>
                    <option value="">Any</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Total Usage Limit</label>
                  <input type="number" placeholder="Total Limit" className={styles.extractedStyle184} value={couponForm.usage_limit} onChange={(e)=>setCouponForm({...couponForm,usage_limit:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Limit Per User</label>
                  <input type="number" placeholder="User Limit" className={styles.extractedStyle184} value={couponForm.usage_limit_per_user} onChange={(e)=>setCouponForm({...couponForm,usage_limit_per_user:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.extractedStyle183}>Starts At</label>
                  <input type="date" className={styles.extractedStyle184} value={couponForm.starts_at} onChange={(e)=>setCouponForm({...couponForm,starts_at:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
                <div>
                  <label className={styles.extractedStyle183}>Ends At</label>
                  <input type="date" className={styles.extractedStyle184} value={couponForm.ends_at} onChange={(e)=>setCouponForm({...couponForm,ends_at:e.target.value})} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)'} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="couponIsActive"
                  checked={couponForm.is_active} 
                  onChange={(e)=>setCouponForm({...couponForm,is_active:e.target.checked})} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#667eea' }}
                />
                <label htmlFor="couponIsActive" className={styles.extractedStyle183} style={{ marginBottom: 0, cursor: 'pointer' }}>Is Active</label>
              </div>
              <div className={styles.extractedStyle185} style={{ gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={()=>setShowCouponModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', padding: '16px 32px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', minWidth: '120px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                >Cancel</button>
                <button 
                  type="submit" 
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px 32px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', minWidth: '120px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
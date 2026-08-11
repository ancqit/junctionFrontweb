export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary';

export interface EmployeeAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
}

export interface Employee {
  id: string;
  store_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone_number: string;
  role: string;
  department: string;
  employment_type: EmploymentType;
  status: EmploymentStatus;
  hire_date: string;
  termination_date?: string | null;
  manager_id?: string | null;
  salary?: number | null;
  address?: EmployeeAddress | null;
  emergency_contact?: EmergencyContact | null;
  notes?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type EmployeeCreate = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
export type EmployeeUpdate = Partial<Omit<EmployeeCreate, 'store_id'>>;

export type ProductStatus = 'active' | 'inactive' | 'discontinued';
export type ProductImageSource = 'cdn' | 'query' | 'upload' | 'pexels';

export interface ProductImage {
  source: ProductImageSource;
  cdn?: string | null;
  stored_image_id?: string | null;
  content_type?: string | null;
  filename?: string | null;
}

export interface ProductImageSuggestResponse {
  product_name: string;
  styles: string[];
  images: ImageSearchResult[];
}

export interface Product {
  id: string;
  store_id: string;
  sku: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  cost_price?: number | null;
  currency: string;
  stock_quantity: number;
  unit: string;
  status: ProductStatus;
  tags: string[];
  image_cdn?: string | null;
  image?: ProductImage | null;
  image_url?: string | null;
  images?: ProductImage[];
  barcode?: string | null;
  tax_rate?: number | null;
  low_stock_threshold?: number | null;
  created_at: string;
  updated_at: string;
}

export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<Omit<ProductCreate, 'store_id'>>;

export interface ImageSearchResult {
  id: string;
  cdn_url: string;
  thumbnail_url: string;
  alt: string;
  width: number;
  height: number;
  source: string;
  photographer?: string | null;
  photographer_url?: string | null;
}

export interface ImageSearchResponse {
  query: string;
  page: number;
  per_page: number;
  total_results: number;
  images: ImageSearchResult[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';

export interface BillingAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderLineItem {
  product_id?: string | null;
  product_name: string;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  line_total?: number;
}

export interface BillingDetails {
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  billing_address?: BillingAddress | null;
}

export interface Order {
  id: string;
  order_number: string;
  store_id: string;
  customer_name: string;
  customer_phone?: string | null;
  customer_email?: string | null;
  items: OrderLineItem[];
  billing: BillingDetails;
  status: OrderStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderCreate = Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>;

/** Matches junctionBack plan_service.PlanType */
export type PlanType = 'free_trial' | 'starter' | 'growth' | 'premium';
export type PlanStatus = 'active' | 'grace_period' | 'expired' | 'cancelled' | 'deactivated';

export interface PlanOption {
  type: PlanType;
  name: string;
  price_inr: number;
  max_products: number | null;
  profile_only: boolean;
  description: string;
  duration_days?: number | null;
}

export interface PlanSummary {
  type: PlanType;
  status: PlanStatus;
  name: string;
  price_inr: number;
  max_products: number | null;
  profile_only: boolean;
  description: string;
  started_at: string;
  ends_at?: string | null;
  days_remaining?: number | null;
  is_active: boolean;
  trial_used: boolean;
  selected_plan_type?: PlanType | null;
  in_grace_period?: boolean;
  grace_ends_at?: string | null;
}

export const FREE_TRIAL_DAYS = 15;
export const PAID_PLAN_DAYS = 365;

export const PLAN_CATALOG: PlanOption[] = [
  {
    type: 'free_trial',
    name: 'Free Trial',
    price_inr: 0,
    max_products: 150,
    profile_only: false,
    description: 'Try all features free for 15 days',
    duration_days: FREE_TRIAL_DAYS,
  },
  {
    type: 'starter',
    name: 'Starter',
    price_inr: 0,
    max_products: 10,
    profile_only: false,
    description: 'Profile and up to 10 products · billed yearly',
    duration_days: PAID_PLAN_DAYS,
  },
  {
    type: 'growth',
    name: 'Growth',
    price_inr: 399,
    max_products: 100,
    profile_only: false,
    description: 'Add up to 100 products · billed yearly',
    duration_days: PAID_PLAN_DAYS,
  },
  {
    type: 'premium',
    name: 'Premium',
    price_inr: 599,
    max_products: null,
    profile_only: false,
    description: 'Add more than 150 products · billed yearly',
    duration_days: PAID_PLAN_DAYS,
  },
];

export interface UserProfile {
  id: string;
  email?: string | null;
  phone_number?: string | null;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  /** From junctionBack GET /profile (main). */
  digilocker_verified?: boolean | null;
  digilocker_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

/** Matches junctionBack POST /descriptions/generate */
export interface DescriptionResponse {
  description: string;
}

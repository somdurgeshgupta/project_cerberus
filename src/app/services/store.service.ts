import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ProductVariant {
  variantId: string;
  sku?: string;
  name?: string;
  design?: string;
  color?: string;
  size?: string;
  inventoryCount?: number;
  imageUrl?: string;
  tone?: 'sun' | 'sky' | 'clay' | 'forest';
  attributes?: Record<string, unknown>;
  price: number;
  basePrice?: number;
  priceDisplay?: string;
  basePriceDisplay?: string;
}

export interface ProductVariantOptions {
  designs: string[];
  colors: string[];
  sizes: string[];
}

export interface ProductReview {
  reviewId: string;
  title?: string;
  comment: string;
  rating: number;
  userName: string;
  verified?: boolean;
  createdAt?: string | null;
}

export interface StoreProduct {
  id: string;
  productId?: string;
  name: string;
  category: string;
  price: number;
  basePrice?: number;
  priceDisplay: string;
  basePriceDisplay?: string;
  originalPrice?: number;
  originalPriceDisplay?: string;
  hasDiscount?: boolean;
  discountLabel?: string;
  tag: string;
  imageUrl: string;
  tone: 'sun' | 'sky' | 'clay' | 'forest';
  shortDescription: string;
  longDescription: string;
  material: string;
  rating?: number;
  reviewCount?: number;
  brand?: unknown;
  brandName?: string;
  categoryHierarchy?: unknown[];
  discount?: unknown;
  variants?: ProductVariant[];
  variantOptions?: ProductVariantOptions;
  selectedVariant?: ProductVariant | null;
  reviews?: {
    count: number;
    items: ProductReview[];
  };
}

export interface StoreProductListResponse {
  items: StoreProduct[];
  pagination: {
    limit: number;
    skip: number;
    total: number;
    hasMore: boolean;
  };
}

export interface AddressRecord {
  _id?: string;
  id?: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ProductSelectionSnapshot {
  variantId?: string;
  sku?: string;
  name?: string;
  design?: string;
  color?: string;
  size?: string;
}

export interface StoreCollectionState {
  addresses: AddressRecord[];
  cart: Array<{
    id: string;
    productId: string;
    quantity: number;
    product: {
      productId: string;
      name: string;
      category: string;
      price: number;
      basePrice?: number;
      priceDisplay: string;
      imageUrl: string;
      imageTone: string;
      shortDescription: string;
      brandName?: string;
      selectedVariant?: ProductSelectionSnapshot | null;
    };
  }>;
  wishlist: Array<{
    id: string;
    productId: string;
    product: {
      productId: string;
      name: string;
      category: string;
      price: number;
      priceDisplay: string;
      imageUrl: string;
      imageTone: string;
      shortDescription: string;
      brandName?: string;
      selectedVariant?: ProductSelectionSnapshot | null;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}store`;

  getProducts(params?: { limit?: number; skip?: number; q?: string; excludeId?: string }) {
    let httpParams = new HttpParams();

    if (params?.limit) {
      httpParams = httpParams.set('limit', String(params.limit));
    }
    if (typeof params?.skip === 'number') {
      httpParams = httpParams.set('skip', String(params.skip));
    }
    if (params?.q) {
      httpParams = httpParams.set('q', params.q);
    }
    if (params?.excludeId) {
      httpParams = httpParams.set('excludeId', params.excludeId);
    }

    return this.http.get<StoreProductListResponse>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProductById(productId: string, variantId?: string | null) {
    let params = new HttpParams();
    if (variantId) {
      params = params.set('variantId', variantId);
    }

    return this.http.get<StoreProduct>(`${this.baseUrl}/products/${productId}`, { params });
  }

  getMyStore() {
    return this.http.get<StoreCollectionState>(`${this.baseUrl}/me/store`);
  }

  addToCart(productId: string, quantity = 1, variantId?: string | null) {
    return this.http.post<StoreCollectionState>(`${this.baseUrl}/cart`, { productId, quantity, variantId });
  }

  updateCartQuantity(itemId: string, quantity: number) {
    return this.http.put<StoreCollectionState>(`${this.baseUrl}/cart/${itemId}`, { quantity });
  }

  removeFromCart(itemId: string) {
    return this.http.delete<StoreCollectionState>(`${this.baseUrl}/cart/${itemId}`);
  }

  addToWishlist(productId: string) {
    return this.http.post<StoreCollectionState>(`${this.baseUrl}/wishlist`, { productId });
  }

  removeFromWishlist(productId: string) {
    return this.http.delete<StoreCollectionState>(`${this.baseUrl}/wishlist/${productId}`);
  }

  getOrders() {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }

  addAddress(address: AddressRecord) {
    return this.http.post<AddressRecord[]>(`${this.baseUrl}/addresses`, address);
  }

  updateAddress(addressId: string, address: Partial<AddressRecord>) {
    return this.http.put<AddressRecord[]>(`${this.baseUrl}/addresses/${addressId}`, address);
  }

  deleteAddress(addressId: string) {
    return this.http.delete<AddressRecord[]>(`${this.baseUrl}/addresses/${addressId}`);
  }

  getCheckoutSummary() {
    return this.http.get<any>(`${this.baseUrl}/checkout/summary`);
  }

  placeOrder(payload: { source: 'cart' | 'buy-now'; addressId: string; productId?: string; quantity?: number; variantId?: string; notes?: string }) {
    return this.http.post<any>(`${this.baseUrl}/orders/place`, payload);
  }
}

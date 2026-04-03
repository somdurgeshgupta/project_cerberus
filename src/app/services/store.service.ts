import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface StoreProduct {
  id: string;
  productId?: string;
  name: string;
  category: string;
  price: number;
  priceDisplay: string;
  tag: string;
  imageUrl: string;
  tone: 'sun' | 'sky' | 'clay' | 'forest';
  shortDescription: string;
  longDescription: string;
  material: string;
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
      priceDisplay: string;
      imageUrl: string;
      imageTone: string;
      shortDescription: string;
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
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}store`;

  getProducts() {
    return this.http.get<StoreProduct[]>(`${this.baseUrl}/products`);
  }

  getProductById(productId: string) {
    return this.http.get<StoreProduct>(`${this.baseUrl}/products/${productId}`);
  }

  getMyStore() {
    return this.http.get<StoreCollectionState>(`${this.baseUrl}/me/store`);
  }

  addToCart(productId: string, quantity = 1) {
    return this.http.post<StoreCollectionState>(`${this.baseUrl}/cart`, { productId, quantity });
  }

  updateCartQuantity(productId: string, quantity: number) {
    return this.http.put<StoreCollectionState>(`${this.baseUrl}/cart/${productId}`, { quantity });
  }

  removeFromCart(productId: string) {
    return this.http.delete<StoreCollectionState>(`${this.baseUrl}/cart/${productId}`);
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

  updateAddress(addressId: string, address: AddressRecord) {
    return this.http.put<AddressRecord[]>(`${this.baseUrl}/addresses/${addressId}`, address);
  }

  deleteAddress(addressId: string) {
    return this.http.delete<AddressRecord[]>(`${this.baseUrl}/addresses/${addressId}`);
  }

  getCheckoutSummary() {
    return this.http.get<any>(`${this.baseUrl}/checkout/summary`);
  }

  placeOrder(payload: { source: 'cart' | 'buy-now'; addressId: string; productId?: string; quantity?: number; notes?: string }) {
    return this.http.post<any>(`${this.baseUrl}/orders/place`, payload);
  }
}

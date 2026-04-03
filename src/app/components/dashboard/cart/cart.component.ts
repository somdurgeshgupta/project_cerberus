import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreCollectionState, StoreService } from '../../../services/store.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  storeState?: StoreCollectionState;
  loading = false;
  brokenImages = new Set<string>();

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.brokenImages.clear();

    forkJoin({
      state: this.storeService.getMyStore(),
      products: this.storeService.getProducts()
    }).subscribe({
      next: ({ state, products }) => {
        const productMap = new Map(products.map((product) => [product.id, product]));

        this.storeState = {
          ...state,
          cart: state.cart.map((item) => {
            const liveProduct = productMap.get(item.productId);
            return {
              ...item,
              product: {
                ...item.product,
                imageUrl: item.product.imageUrl || liveProduct?.imageUrl || '',
                imageTone: item.product.imageTone || liveProduct?.tone || 'sun',
                shortDescription: item.product.shortDescription || liveProduct?.shortDescription || ''
              }
            };
          })
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    const nextQuantity = Math.max(1, quantity);
    this.storeService.updateCartQuantity(productId, nextQuantity).subscribe((state) => {
      this.storeState = {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === productId && this.storeState
            ? {
                ...item,
                product: {
                  ...item.product,
                  imageUrl:
                    item.product.imageUrl ||
                    this.storeState.cart.find((cartItem) => cartItem.productId === item.productId)?.product.imageUrl ||
                    ''
                }
              }
            : item
        )
      };
    });
  }

  removeItem(productId: string): void {
    this.storeService.removeFromCart(productId).subscribe((state) => {
      this.storeState = state;
    });
  }

  hasValidImage(productId: string, imageUrl?: string): boolean {
    return !!imageUrl && !this.brokenImages.has(productId);
  }

  markImageBroken(productId: string): void {
    this.brokenImages.add(productId);
  }

  goToCheckout(): void {
    this.router.navigate(['/dashboard/checkout']);
  }
}

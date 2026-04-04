import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreCollectionState, StoreService } from '../../../services/store.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  storeState?: StoreCollectionState;
  brokenImages = new Set<string>();

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.brokenImages.clear();

    forkJoin({
      state: this.storeService.getMyStore(),
      products: this.storeService.getProducts()
    }).subscribe(({ state, products }) => {
      const productMap = new Map(products.items.map((product) => [product.id, product]));

      this.storeState = {
        ...state,
        wishlist: state.wishlist.map((item) => {
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
    });
  }

  remove(productId: string): void {
    this.storeService.removeFromWishlist(productId).subscribe((state) => {
      this.storeState = state;
    });
  }

  moveToCart(productId: string): void {
    this.storeService.addToCart(productId, 1).subscribe(() => {
      this.storeService.removeFromWishlist(productId).subscribe((state) => {
        this.storeState = state;
      });
    });
  }

  openProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  hasValidImage(productId: string, imageUrl?: string): boolean {
    return !!imageUrl && !this.brokenImages.has(productId);
  }

  markImageBroken(productId: string): void {
    this.brokenImages.add(productId);
  }
}

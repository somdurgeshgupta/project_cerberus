import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreCollectionState, StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  storeState?: StoreCollectionState;

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.storeService.getMyStore().subscribe((state) => {
      this.storeState = state;
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
}

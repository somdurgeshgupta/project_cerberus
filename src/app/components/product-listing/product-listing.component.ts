import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreProduct, StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-listing',
  standalone: false,
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.css'
})
export class ProductListingComponent implements OnInit {
  searchTerm = '';
  allProducts: StoreProduct[] = [];
  filteredProducts: StoreProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.filteredProducts = products;
      this.route.queryParamMap.subscribe((params) => {
        this.searchTerm = params.get('q') ?? '';
        this.applyFilter();
      });
    });
  }

  applyFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = this.allProducts.filter((product) =>
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query)
    );
  }

  startPurchase(productId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/checkout'], {
        queryParams: { source: 'buy-now', productId }
      });
      return;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/dashboard/checkout?source=buy-now&productId=${productId}` }
    });
  }

  openDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(productId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${productId}` }
      });
      return;
    }

    this.storeService.addToCart(productId).subscribe(() => {
      this.router.navigate(['/dashboard/cart']);
    });
  }

  addToWishlist(productId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${productId}` }
      });
      return;
    }

    this.storeService.addToWishlist(productId).subscribe(() => {
      this.router.navigate(['/dashboard/wishlist']);
    });
  }
}

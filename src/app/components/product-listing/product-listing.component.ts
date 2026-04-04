import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('listingGrid') listingGrid?: ElementRef<HTMLElement>;
  searchTerm = '';
  products: StoreProduct[] = [];
  totalProducts = 0;
  hasMore = true;
  loading = false;
  readonly pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('q') ?? '';
      this.products = [];
      this.totalProducts = 0;
      this.hasMore = true;
      this.loadProducts(true);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const gridElement = this.listingGrid?.nativeElement;
    if (!gridElement || this.loading || !this.hasMore) {
      return;
    }

    const gridBottom = gridElement.getBoundingClientRect().bottom;
    const viewportBottom = window.innerHeight;
    const preloadOffset = 40;

    if (gridBottom <= viewportBottom + preloadOffset) {
      this.loadProducts();
    }
  }

  loadProducts(reset = false): void {
    if (this.loading || (!reset && !this.hasMore)) {
      return;
    }

    this.loading = true;
    this.storeService.getProducts({
      limit: this.pageSize,
      skip: reset ? 0 : this.products.length,
      q: this.searchTerm.trim()
    }).subscribe({
      next: (response) => {
        this.products = reset ? response.items : [...this.products, ...response.items];
        this.totalProducts = response.pagination.total;
        this.hasMore = response.pagination.hasMore;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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

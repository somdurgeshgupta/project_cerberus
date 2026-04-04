import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductVariant, StoreProduct, StoreService } from '../../services/store.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product?: StoreProduct;
  relatedProducts: StoreProduct[] = [];
  relatedHasMore = true;
  relatedLoading = false;
  readonly relatedPageSize = 10;
  selectedVariantId = '';
  selectedDesign = '';
  selectedColor = '';
  selectedSize = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, queryParams]) => {
      const productId = params.get('id');
      if (!productId) {
        this.router.navigate(['/listing']);
        return;
      }

      this.selectedVariantId = queryParams.get('variantId') ?? '';

      this.storeService.getProductById(productId, this.selectedVariantId).subscribe({
        next: (product) => {
          this.product = product;
          this.syncVariantSelectors();
          this.relatedProducts = [];
          this.relatedHasMore = true;
          this.loadMoreRelated();
        },
        error: () => this.router.navigate(['/listing'])
      });
    });
  }

  syncVariantSelectors(): void {
    if (!this.product) {
      return;
    }

    this.selectedVariantId = this.product.selectedVariant?.variantId || '';
    this.selectedDesign = this.product.selectedVariant?.design || this.product.variantOptions?.designs?.[0] || '';
    this.selectedColor = this.product.selectedVariant?.color || this.product.variantOptions?.colors?.[0] || '';
    this.selectedSize = this.product.selectedVariant?.size || this.product.variantOptions?.sizes?.[0] || '';
  }

  loadMoreRelated(): void {
    if (!this.product?.id || this.relatedLoading || !this.relatedHasMore) {
      return;
    }

    this.relatedLoading = true;
    this.storeService.getProducts({
      limit: this.relatedPageSize,
      skip: this.relatedProducts.length,
      excludeId: this.product.id
    }).subscribe({
      next: (response) => {
        this.relatedProducts = [...this.relatedProducts, ...response.items];
        this.relatedHasMore = response.pagination.hasMore;
        this.relatedLoading = false;
      },
      error: () => {
        this.relatedLoading = false;
      }
    });
  }

  onVariantOptionChange(): void {
    this.updateVariantQuery(this.findVariantIdBySelections());
  }

  findVariantIdBySelections(): string {
    const variants = this.product?.variants || [];
    if (!variants.length) {
      return '';
    }

    const match = variants.find((variant) => this.matchesSelection(variant));
    return match?.variantId || variants[0].variantId || '';
  }

  matchesSelection(variant: ProductVariant): boolean {
    const designMatches = !this.selectedDesign || !variant.design || variant.design === this.selectedDesign;
    const colorMatches = !this.selectedColor || !variant.color || variant.color === this.selectedColor;
    const sizeMatches = !this.selectedSize || !variant.size || variant.size === this.selectedSize;
    return designMatches && colorMatches && sizeMatches;
  }

  updateVariantQuery(variantId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { variantId: variantId || null },
      queryParamsHandling: 'merge'
    });
  }

  hasVariants(): boolean {
    return !!this.product?.variants?.length;
  }

  getActiveVariantLabel(): string {
    if (!this.product?.selectedVariant) {
      return 'Default selection';
    }

    return [
      this.product.selectedVariant.design,
      this.product.selectedVariant.color,
      this.product.selectedVariant.size
    ].filter(Boolean).join(' / ') || this.product.selectedVariant.name || 'Default selection';
  }

  getReviewDate(createdAt?: string | null): string {
    if (!createdAt) {
      return 'Recent review';
    }

    return new Date(createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  proceedToBuy(): void {
    if (!this.product) {
      return;
    }

    const queryParams: Record<string, string> = {
      source: 'buy-now',
      productId: this.product.id
    };

    if (this.selectedVariantId) {
      queryParams['variantId'] = this.selectedVariantId;
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/checkout'], { queryParams });
      return;
    }

    const variantSuffix = this.selectedVariantId ? `&variantId=${encodeURIComponent(this.selectedVariantId)}` : '';
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/dashboard/checkout?source=buy-now&productId=${this.product.id}${variantSuffix}` }
    });
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      const variantSuffix = this.selectedVariantId ? `?variantId=${encodeURIComponent(this.selectedVariantId)}` : '';
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${this.product.id}${variantSuffix}` }
      });
      return;
    }

    this.storeService.addToCart(this.product.id, 1, this.selectedVariantId || null).subscribe(() => {
      this.router.navigate(['/dashboard/cart']);
    });
  }

  addToWishlist(): void {
    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      const variantSuffix = this.selectedVariantId ? `?variantId=${encodeURIComponent(this.selectedVariantId)}` : '';
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${this.product.id}${variantSuffix}` }
      });
      return;
    }

    this.storeService.addToWishlist(this.product.id).subscribe(() => {
      this.router.navigate(['/dashboard/wishlist']);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreProduct, StoreService } from '../../services/store.service';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  categories = [
    { name: 'New Drops', subtitle: 'Fresh weekly arrivals', accent: 'Citrus Edit' },
    { name: 'Home Rituals', subtitle: 'Calm corners, elevated details', accent: 'Soft Furnishings' },
    { name: 'Street Layers', subtitle: 'Everyday style with standout silhouettes', accent: 'Modern Apparel' }
  ];

  featuredProducts: StoreProduct[] = [];

  highlights = [
    { value: '48h', label: 'dispatch window on top collections' },
    { value: '4.9/5', label: 'average rating from verified buyers' },
    { value: '120+', label: 'design-led brands curated in one place' }
  ];

  testimonials = [
    {
      quote: 'The site feels premium and the checkout flow is incredibly smooth. It finally feels like a store with taste.',
      author: 'Aarav Mehta',
      role: 'Frequent buyer'
    },
    {
      quote: 'I found pieces for my home and wardrobe in one session. The recommendations felt thoughtful, not noisy.',
      author: 'Riya Kapoor',
      role: 'Interior stylist'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
      return;
    }

    this.storeService.getProducts().subscribe((products) => {
      this.featuredProducts = products.slice(0, 3);
    });
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  startPurchase(productId: string): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/dashboard/checkout?source=buy-now&productId=${productId}` }
    });
  }

  addToCart(productId: string): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/products/${productId}` }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  summary: any;
  selectedAddressId = '';
  notes = '';
  source: 'cart' | 'buy-now' = 'cart';
  productId: string | null = null;
  buyNowProduct: any = null;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.source = params.get('source') === 'buy-now' ? 'buy-now' : 'cart';
      this.productId = params.get('productId');
      this.loadSummary();
    });
  }

  loadSummary(): void {
    this.storeService.getCheckoutSummary().subscribe((summary) => {
      const defaultAddress = summary.addresses.find((address: any) => address.isDefault) || summary.addresses[0];
      this.selectedAddressId = defaultAddress?.id || defaultAddress?._id || '';

      if (this.source === 'buy-now' && this.productId) {
        this.storeService.getProductById(this.productId).subscribe((product) => {
          this.buyNowProduct = product;
          this.summary = {
            ...summary,
            cart: [
              {
                productId: product.id,
                quantity: 1,
                product: {
                  ...product,
                  imageTone: product.tone
                }
              }
            ],
            totals: {
              subtotal: product.price,
              shipping: 99,
              total: product.price + 99,
              subtotalDisplay: this.formatCurrency(product.price),
              shippingDisplay: this.formatCurrency(99),
              totalDisplay: this.formatCurrency(product.price + 99)
            }
          };
        });
        return;
      }

      this.buyNowProduct = null;
      this.summary = summary;
    });
  }

  placeOrder(): void {
    if (!this.selectedAddressId) {
      return;
    }

    this.storeService.placeOrder({
      source: this.source,
      addressId: this.selectedAddressId,
      productId: this.productId || undefined,
      notes: this.notes
    }).subscribe(() => {
      this.router.navigate(['/dashboard/orders']);
    });
  }
}

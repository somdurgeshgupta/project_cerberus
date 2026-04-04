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
  addressNotice = '';
  source: 'cart' | 'buy-now' = 'cart';
  productId: string | null = null;
  variantId: string | null = null;
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
      this.variantId = params.get('variantId');
      this.loadSummary();
    });
  }

  loadSummary(): void {
    this.storeService.getCheckoutSummary().subscribe((summary) => {
      const defaultAddress = summary.addresses.find((address: any) => address.isDefault) || summary.addresses[0];
      this.selectedAddressId = defaultAddress?.id || defaultAddress?._id || '';
      this.addressNotice = summary.addresses?.length ? '' : 'Add a delivery address before you can place your order.';

      if (this.source === 'buy-now' && this.productId) {
        this.storeService.getProductById(this.productId, this.variantId).subscribe((product) => {
          this.buyNowProduct = product;
          this.summary = {
            ...summary,
            cart: [
              {
                productId: product.id,
                quantity: 1,
                product: {
                  ...product,
                  imageTone: product.selectedVariant?.tone || product.tone
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

  getVariantLabel(selection?: { design?: string; color?: string; size?: string } | null): string {
    return [selection?.design, selection?.color, selection?.size].filter((value): value is string => !!value).join(' / ');
  }

  placeOrder(): void {
    if (!this.selectedAddressId) {
      this.addressNotice = 'Add a delivery address before you can place your order.';
      return;
    }

    this.addressNotice = '';

    this.storeService.placeOrder({
      source: this.source,
      addressId: this.selectedAddressId,
      productId: this.productId || undefined,
      variantId: this.variantId || undefined,
      notes: this.notes
    }).subscribe(() => {
      this.router.navigate(['/dashboard/orders']);
    });
  }
}

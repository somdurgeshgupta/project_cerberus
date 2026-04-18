import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService, PlaceOrderPayload, RazorpayOrderResponse } from '../../../services/store.service';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

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
  paymentNotice = '';
  source: 'cart' | 'buy-now' = 'cart';
  productId: string | null = null;
  variantId: string | null = null;
  buyNowProduct: any = null;
  isPlacingOrder = false;
  currentPaymentOrderId = '';

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

  private getOrderPayload(): PlaceOrderPayload | null {
    if (!this.selectedAddressId) {
      this.addressNotice = 'Add a delivery address before you can place your order.';
      return null;
    }

    this.addressNotice = '';
    this.paymentNotice = '';

    return {
      source: this.source,
      addressId: this.selectedAddressId,
      productId: this.productId || undefined,
      variantId: this.variantId || undefined,
      notes: this.notes
    };
  }

  private loadRazorpayScript(): Promise<void> {
    if (window.Razorpay) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-razorpay-checkout="true"]') as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.dataset['razorpayCheckout'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
      document.body.appendChild(script);
    });
  }

  startCheckout(): void {
    const payload = this.getOrderPayload();
    if (!payload) {
      return;
    }

    this.isPlacingOrder = true;

    this.loadRazorpayScript()
      .then(() => this.storeService.createRazorpayOrder(payload).subscribe({
        next: (response) => {
          this.currentPaymentOrderId = response.orderId;
          this.openRazorpayCheckout(response);
        },
        error: (error) => {
          this.paymentNotice = error?.error?.message || 'Unable to start Razorpay checkout.';
          this.isPlacingOrder = false;
        }
      }))
      .catch((error: Error) => {
        this.paymentNotice = error.message || 'Unable to load Razorpay checkout.';
        this.isPlacingOrder = false;
      });
  }

  private openRazorpayCheckout(paymentOrder: RazorpayOrderResponse): void {
    if (!window.Razorpay) {
      this.paymentNotice = 'Razorpay checkout is unavailable right now.';
      this.isPlacingOrder = false;
      return;
    }

    const razorpay = new window.Razorpay({
      key: paymentOrder.keyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'Cerberus',
      description: 'Sandbox checkout payment',
      order_id: paymentOrder.razorpayOrderId,
      prefill: paymentOrder.customer,
      theme: {
        color: '#1d2735'
      },
      handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        this.storeService.verifyRazorpayPayment({
          orderId: paymentOrder.orderId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }).subscribe({
          next: () => {
            this.currentPaymentOrderId = '';
            this.router.navigate(['/dashboard/orders']);
          },
          error: (error) => {
            this.paymentNotice = error?.error?.message || 'Payment verification failed.';
            this.isPlacingOrder = false;
          }
        });
      },
      modal: {
        ondismiss: () => {
          this.handlePaymentFailure(paymentOrder.orderId, 'Checkout closed before payment completion.');
        }
      }
    });

    razorpay.open();
  }

  private handlePaymentFailure(orderId: string, reason: string): void {
    this.storeService.markRazorpayPaymentFailed({ orderId, reason }).subscribe({
      next: () => {
        this.currentPaymentOrderId = '';
        this.paymentNotice = 'Payment was not completed. The transaction was saved as failed in your orders.';
        this.isPlacingOrder = false;
        this.router.navigate(['/dashboard/orders']);
      },
      error: () => {
        this.paymentNotice = 'Payment was not completed, but we could not update the failed transaction status.';
        this.isPlacingOrder = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressRecord, StoreCollectionState, StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-addresses',
  standalone: false,
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {
  storeState?: StoreCollectionState;
  addressForm: FormGroup;

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder
  ) {
    this.addressForm = this.fb.group({
      label: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['India', Validators.required],
      isDefault: [false]
    });
  }

  ngOnInit(): void {
    this.loadStore();
  }

  loadStore(): void {
    this.storeService.getMyStore().subscribe((state) => {
      this.storeState = state;
    });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      return;
    }

    this.storeService.addAddress(this.addressForm.value as AddressRecord).subscribe((addresses) => {
      if (this.storeState) {
        this.storeState.addresses = addresses;
      }
      this.addressForm.reset({ country: 'India', isDefault: false });
    });
  }

  deleteAddress(addressId?: string): void {
    if (!addressId) {
      return;
    }

    this.storeService.deleteAddress(addressId).subscribe((addresses) => {
      if (this.storeState) {
        this.storeState.addresses = addresses;
      }
    });
  }

  setDefaultAddress(address: AddressRecord): void {
    const addressId = address.id || address._id;
    if (!addressId) {
      return;
    }

    this.storeService.updateAddress(addressId, {
      ...address,
      isDefault: true
    }).subscribe((addresses) => {
      if (this.storeState) {
        this.storeState.addresses = addresses;
      }
    });
  }
}

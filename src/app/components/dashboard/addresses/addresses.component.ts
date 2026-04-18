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
  submitted = false;
  editingAddressId: string | null = null;
  private originalAddressValues: Partial<AddressRecord> | null = null;

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
    this.submitted = true;

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const addressPayload = this.addressForm.getRawValue() as AddressRecord;

    if (this.editingAddressId) {
      const changedFields = this.getChangedAddressFields(addressPayload);
      if (!Object.keys(changedFields).length) {
        this.resetForm();
        return;
      }

      this.storeService.updateAddress(this.editingAddressId, changedFields).subscribe((addresses) => {
        if (this.storeState) {
          this.storeState.addresses = addresses;
        }
        this.resetForm();
      });

      return;
    }

    this.storeService.addAddress(addressPayload).subscribe((addresses) => {
      if (this.storeState) {
        this.storeState.addresses = addresses;
      }
      this.resetForm();
    });
  }

  hasError(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  deleteAddress(addressId?: string): void {
    if (!addressId) {
      return;
    }

    this.storeService.deleteAddress(addressId).subscribe((addresses) => {
      if (this.storeState) {
        this.storeState.addresses = addresses;
      }

      if (this.editingAddressId === addressId) {
        this.resetForm();
      }
    });
  }

  startEditing(address: AddressRecord): void {
    const addressId = address.id || address._id;
    if (!addressId) {
      return;
    }

    this.editingAddressId = addressId;
    this.submitted = false;
    this.originalAddressValues = {
      label: address.label || '',
      fullName: address.fullName || '',
      phoneNumber: address.phoneNumber || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      isDefault: !!address.isDefault
    };
    this.addressForm.reset(this.originalAddressValues);
  }

  cancelEditing(): void {
    this.resetForm();
  }

  setDefaultAddress(address: AddressRecord): void {
    const addressId = address.id || address._id;
    if (!addressId) {
      return;
    }

    this.storeService.updateAddress(addressId, {
      isDefault: true
    }).subscribe((addresses) => {
      if (this.storeState) {
        this.storeState.addresses = addresses;
      }
    });
  }

  private resetForm(): void {
    this.addressForm.reset({
      label: '',
      fullName: '',
      phoneNumber: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false
    });
    this.editingAddressId = null;
    this.originalAddressValues = null;
    this.submitted = false;
  }

  private getChangedAddressFields(currentValues: AddressRecord): Partial<AddressRecord> {
    if (!this.originalAddressValues) {
      return currentValues;
    }

    const changedFields: Partial<AddressRecord> = {};
    const mutableChangedFields = changedFields as Record<keyof AddressRecord, AddressRecord[keyof AddressRecord]>;

    (Object.keys(currentValues) as Array<keyof AddressRecord>).forEach((key) => {
      if (currentValues[key] !== this.originalAddressValues?.[key]) {
        mutableChangedFields[key] = currentValues[key];
      }
    });

    return changedFields;
  }
}

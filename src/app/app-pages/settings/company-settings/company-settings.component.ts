import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanySettingsService } from '../../../services/company-settings.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CompanySettingsComponent implements OnInit {
  companyForm: FormGroup;
  isLoading = true;
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private companySettingsService: CompanySettingsService,
    private authService: AuthService
  ) {
    this.companyForm = this.fb.group({
      name: [''], // Optional field
      legalName: [''], // Optional field
      address: [''], // Optional field
      taxNumber: [''], // Optional field
      eInvoiceClientId: [''], // Optional field
      eInvoiceSecretKey: [''], // Optional but must be a valid email if provided
      whatsAppKey: [''], // Optional field
      phone: [''], // Optional field
      email: [''], // Optional field
      website: [''], // Optional field
      logoImage: [''], // Optional field
      eInvoiceLink: [''], // Optional field
      legalId: [''],
    });
  }

  ngOnInit(): void {
    this.fetchCompanySettings();
  }

  fetchCompanySettings() {
    this.companySettingsService.getCompanySettings().subscribe(
      (data) => {
        if (data) {
          this.companyForm.patchValue({
            name: data.name || '',
            legalName: data.legalName || '',
            address: data.address || '',
            taxNumber: data.taxNumber || '',
            eInvoiceClientId: data.eInvoiceClientId || '',
            eInvoiceSecretKey: data.eInvoiceSecretKey || '',
            whatsAppKey: data.whatsAppKey || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            logoImage: data.logoImage || '',
            eInvoiceLink: data.eInvoiceLink || '',
            legalId: data.legalId || '',
          });
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching company settings:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const formData = new FormData();

      Object.keys(this.companyForm.value).forEach((key) => {
        const value = this.companyForm.value[key];
        if (value) {
          formData.append(key, value); // Append each key-value pair to FormData
        }
      });

      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      console.log('Form Values:', this.companyForm.value);

      this.companySettingsService
        .updateCompanySettings(this.companyForm.value)
        .subscribe(
          (response) => {
            console.log('Company settings updated successfully:', response);
            alert('Settings updated successfully!');
            this.authService.logout();
          },
          (error) => {
            console.error('Error updating company settings:', error);
            alert('Failed to update settings.');
          }
        );
    }
  }
}

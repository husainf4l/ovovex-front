import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';



export interface Company {
  id: string;
  name: string;
}


@Component({
  selector: 'app-company-select-dialog',
  imports: [CommonModule,
    FormsModule,

    MatDialogModule, MatDialogModule, MatProgressSpinnerModule, MatRadioModule

  ],
  templateUrl: './company-select-dialog.component.html',
  styleUrl: './company-select-dialog.component.css'
})
export class CompanySelectDialogComponent {
  companies: Company[] = [];
  selectedCompanyId: string | null = null;

  isLoading = false;
  isUpdating = false;

  constructor(
    public dialogRef: MatDialogRef<CompanySelectDialogComponent>,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.isLoading = true;
    this.dashboardService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch companies:', err);
        this.isLoading = false;
      },
    });
  }

  onConfirm(): void {
    if (!this.selectedCompanyId) return;

    this.isUpdating = true;
    this.dashboardService.updateCompanySettings(this.selectedCompanyId)
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
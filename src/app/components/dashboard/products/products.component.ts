import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-products',
  standalone: false,

  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  exportJobs: any[] = [];
  loading = false;
  private pollSub?: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchJobs();

    // ⏱️ Poll every 8 seconds for job updates
    this.pollSub = interval(10000).subscribe(() => {
      this.fetchJobs();
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  trackByJobId(index: number, job: any): string {
    return job._id;
  }


 fetchJobs() {
  this.http.get<any[]>(`${environment.API_URL}ideploy/exports/mine`).subscribe({
    next: res => {
      const jobMap = new Map(res.map(job => [job._id, job]));
      this.exportJobs = this.exportJobs.map(existingJob =>
        jobMap.has(existingJob._id) ? { ...existingJob, ...jobMap.get(existingJob._id) } : existingJob
      );

      // Add new jobs that didn't exist before
      const existingIds = new Set(this.exportJobs.map(j => j._id));
      const newJobs = res.filter(job => !existingIds.has(job._id));
      this.exportJobs = [...this.exportJobs, ...newJobs];

      // 🔍 Check if all jobs are either completed, failed, or cancelled
      const active = this.exportJobs.some(job =>
        job.status === 'processing' || job.status === 'pending'
      );

      // 🛑 Stop polling if nothing is active
      if (!active && this.pollSub) {
        this.pollSub.unsubscribe();
        this.pollSub = undefined;
        console.log('📴 Auto-unsubscribed from polling – all jobs completed.');
      }
    },
    error: (err: any) => {
      console.log(err);
    }
  });
}



  download(jobId: string) {
    window.open(`${environment.API_URL}ideploy/exports/download/${jobId}`);
  }

  startExport() {
  this.http.get<any>(`${environment.API_URL}ideploy/export-csv`).subscribe({
    next: res => {
      alert('✅ Export started');
      this.fetchJobs();

      // 🔄 Restart polling if stopped
      if (!this.pollSub) {
        this.pollSub = interval(10000).subscribe(() => {
          this.fetchJobs();
        });
      }
    },
    error: () => {
      alert('❌ Export failed to start');
    }
  });
}


  cancelExport(jobId: string) {
    this.http.post(`${environment.API_URL}ideploy/exports/cancel/${jobId}`, {}).subscribe({
      next: () => this.fetchJobs(),
      error: () => alert('❌ Failed to cancel export')
    });
  }


  getProgress(job: any): number {
    if (!job.totalChunks || job.totalChunks === 0) return 0;
    return Math.round((job.completedChunks / job.totalChunks) * 100);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'badge bg-success';
      case 'failed': return 'badge bg-danger';
      case 'processing': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  }
}
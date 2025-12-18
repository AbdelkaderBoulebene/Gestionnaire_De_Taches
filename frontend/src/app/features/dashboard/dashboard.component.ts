import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Tableau de Bord</h1>
      </div>
      
      <!-- KPI Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card" (click)="navigateToTasks()">
          <div class="stat-value">{{ stats.totalTasks }}</div>
          <div class="stat-label">Total Tâches</div>
          <div class="stat-icon">📋</div>
        </div>
        <div class="stat-card todo" (click)="navigateToTasks('TODO')">
          <div class="stat-value">{{ stats.todoTasks }}</div>
          <div class="stat-label">À Faire</div>
          <div class="stat-icon">📝</div>
        </div>
        <div class="stat-card in-progress" (click)="navigateToTasks('IN_PROGRESS')">
          <div class="stat-value">{{ stats.inProgressTasks }}</div>
          <div class="stat-label">En Cours</div>
          <div class="stat-icon">🚀</div>
        </div>
        <div class="stat-card done" (click)="navigateToTasks('DONE')">
          <div class="stat-value">{{ stats.doneTasks }}</div>
          <div class="stat-label">Terminées</div>
          <div class="stat-icon">✅</div>
        </div>
        <div class="stat-card overdue" (click)="navigateToTasks(undefined, 'overdue')">
          <div class="stat-value">{{ stats.overdueTasks }}</div>
          <div class="stat-label">En Retard</div>
          <div class="stat-icon">⚠️</div>
        </div>
        <div class="stat-card projects" (click)="navigateToProjects('ACTIVE')">
          <div class="stat-value">{{ stats.activeProjects }}</div>
          <div class="stat-label">Projets Actifs</div>
          <div class="stat-icon">📊</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid" *ngIf="stats">
        <div class="card chart-card">
          <h3>Répartition des Statuts</h3>
          <div class="chart-wrapper">
            <canvas baseChart
              [data]="doughnutChartData"
              [type]="doughnutChartType"
              [options]="doughnutChartOptions">
            </canvas>
          </div>
        </div>

        <div class="card chart-card">
          <h3>État Global</h3>
          <div class="chart-wrapper">
            <canvas baseChart
              [data]="barChartData"
              [type]="barChartType"
              [options]="barChartOptions">
            </canvas>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    h1.page-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-heading);
      margin-bottom: 32px;
      text-shadow: 0 0 30px rgba(255,255,255,0.1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      /* Glass effect inherited from global .card or .glass-panel */
      background: var(--glass-surface);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: var(--primary-glow);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, transparent, currentColor, transparent);
      opacity: 0.5;
    }

    /* specific glow colors */
    .stat-card { color: var(--text-muted); }
    .stat-card:nth-child(1) { color: var(--primary-glow); } /* Total */
    .stat-card.todo { color: #94a3b8; }
    .stat-card.in-progress { color: var(--warning-glow); }
    .stat-card.done { color: var(--success-glow); }
    .stat-card.overdue { color: var(--danger-glow); }
    .stat-card.projects { color: var(--accent-glow); }

    .stat-value {
      font-size: 3rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 4px;
      text-shadow: 0 0 20px rgba(255,255,255,0.1);
    }

    .stat-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      color: currentColor; /* Uses the specific color set above */
    }

    .stat-icon {
      position: absolute;
      right: 20px;
      bottom: 20px;
      font-size: 4rem;
      opacity: 0.05;
      color: currentColor;
      transform: rotate(-15deg);
    }

    .chart-card h3 {
      color: var(--text-primary);
      font-family: var(--font-heading);
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--glass-border);
    }

    .chart-wrapper {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .loading { display: flex; justify-content: center; padding: 40px; }
    
    @media (max-width: 768px) {
      .charts-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  // Doughnut Chart Configuration
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, font: { family: 'Inter', size: 12 } } }
    },
    cutout: '70%',
  };
  public doughnutChartType: 'doughnut' = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['À Faire', 'En Cours', 'Terminées'],
    datasets: [{
      data: [],
      backgroundColor: ['#94a3b8', '#fbbf24', '#34d399'], // Slate, Neon Amber, Neon Emerald
      hoverBackgroundColor: ['#cbd5e1', '#fcd34d', '#6ee7b7'],
      borderWidth: 0,
    }]
  };

  // Bar Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: { family: 'Inter' } },
        grid: { color: 'rgba(0,0,0,0.05)' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter' } },
        border: { display: false }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Projets', 'Tâches', 'Retards'],
    datasets: [{
      data: [],
      backgroundColor: ['#60a5fa', '#22d3ee', '#f43f5e'], // Blue, Cyan, Rose neon
      borderRadius: 4,
      barThickness: 30,
    }]
  };

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  navigateToTasks(status?: string, filter?: string): void {
    const queryParams: any = {};
    if (status) queryParams.status = status;
    if (filter) queryParams.filter = filter;
    this.router.navigate(['/tasks'], { queryParams });
  }

  navigateToProjects(status?: string): void {
    const queryParams: any = {};
    if (status) queryParams.status = status;
    this.router.navigate(['/projects'], { queryParams });
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateCharts(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  private updateCharts(data: DashboardStats): void {
    // Update Doughnut Data
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [{
        ...this.doughnutChartData.datasets[0],
        data: [data.todoTasks, data.inProgressTasks, data.doneTasks]
      }]
    };

    // Update Bar Data
    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: [data.activeProjects, data.totalTasks, data.overdueTasks]
      }]
    };
  }
}

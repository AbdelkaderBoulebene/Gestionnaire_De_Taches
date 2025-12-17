import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de Bord</h1>
      
      <!-- KPI Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalTasks }}</div>
          <div class="stat-label">Total Tâches</div>
        </div>
        <div class="stat-card todo">
          <div class="stat-value">{{ stats.todoTasks }}</div>
          <div class="stat-label">À Faire</div>
        </div>
        <div class="stat-card in-progress">
          <div class="stat-value">{{ stats.inProgressTasks }}</div>
          <div class="stat-label">En Cours</div>
        </div>
        <div class="stat-card done">
          <div class="stat-value">{{ stats.doneTasks }}</div>
          <div class="stat-label">Terminées</div>
        </div>
        <div class="stat-card overdue">
          <div class="stat-value">{{ stats.overdueTasks }}</div>
          <div class="stat-label">En Retard</div>
        </div>
        <div class="stat-card projects">
          <div class="stat-value">{{ stats.activeProjects }}</div>
          <div class="stat-label">Projets Actifs</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid" *ngIf="stats">
        <div class="chart-card">
          <h3>Répartition des Statuts</h3>
          <div class="chart-wrapper">
            <canvas baseChart
              [data]="doughnutChartData"
              [type]="doughnutChartType"
              [options]="doughnutChartOptions">
            </canvas>
          </div>
        </div>

        <div class="chart-card">
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
    .dashboard-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    h1 { margin-bottom: 24px; color: #1a202c; }
    h3 { color: #4a5568; margin-bottom: 16px; text-align: center; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #667eea;
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); }

    .stat-card.todo { border-left-color: #4299e1; }
    .stat-card.in-progress { border-left-color: #ed8936; }
    .stat-card.done { border-left-color: #48bb78; }
    .stat-card.overdue { border-left-color: #f56565; }
    .stat-card.projects { border-left-color: #9f7aea; }

    .stat-value { font-size: 36px; font-weight: 700; color: #1a202c; margin-bottom: 8px; }
    .stat-label { font-size: 14px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .chart-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      min-height: 400px;
    }
    
    .chart-wrapper {
      position: relative;
      height: 300px;
      width: 100%;
      display: flex;
      justify-content: center;
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
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['À Faire', 'En Cours', 'Terminées'],
    datasets: [{
      data: [],
      backgroundColor: ['#4299e1', '#ed8936', '#48bb78'],
      hoverBackgroundColor: ['#3182ce', '#dd6b20', '#38a169']
    }]
  };

  // Bar Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Projets', 'Tâches', 'Retards'],
    datasets: [{
      data: [],
      backgroundColor: ['#9f7aea', '#667eea', '#f56565'],
      borderRadius: 6
    }]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadStats();
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

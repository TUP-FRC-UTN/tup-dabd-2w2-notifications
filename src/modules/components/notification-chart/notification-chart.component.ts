import { Component, inject, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/services/notification.service';
import { KPIModel, RetentionKPIs, RetentionMetric } from '../../../app/models/kpi/kpiModel';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { IaService } from '../../../app/services/ia-service';
import { ChartData, ChartOptions } from 'chart.js';
import { RouterModule } from '@angular/router';
import {Subject, takeUntil } from 'rxjs';
import { SubscriptionService } from '../../../app/services/subscription.service';
import { ContactTypeMetricService } from '../../../app/services/dashboard/charts/contact-type-metric.service';
import { NotificationStatusMetricService } from '../../../app/services/dashboard/charts/notification-status-metric.service';
import { NotificationWeeklyMetricService } from '../../../app/services/dashboard/charts/notification-weekly-metric.service';
import { SubscriptionRetentionMetricService } from '../../../app/services/dashboard/charts/suscription-retention-metric.service';
import { SubscriptionOptionalAnalysisMetricService } from '../../../app/services/dashboard/charts/suscription-optional-analysis-metric.service';
import { NotificationKPIViewedModel } from '../../../app/models/notifications/notification';
import { KpiViewedRateService } from '../../../app/services/dashboard/kpi/kpi-viewed-rate.service';


@Component({
  selector: 'app-notification-chart',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BaseChartDirective,
    MainContainerComponent,
    RouterModule
  ],
  templateUrl: './notification-chart.component.html',
  styleUrl: './notification-chart.component.css'
})


export class NotificationChartComponent implements OnInit {


  //START REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW

  constructor(
    private contactTypeMetricService: ContactTypeMetricService,
    private notificationStatusMetricService: NotificationStatusMetricService,
    private weeklyMetricService: NotificationWeeklyMetricService,
    private subscriptionRetentionMetricService: SubscriptionRetentionMetricService,
    private subscriptionOptionalAnalysisMetricService: SubscriptionOptionalAnalysisMetricService,
    private kpiViewedRateService: KpiViewedRateService

  ) {

    this.chartOptionsContactType = this.contactTypeMetricService.getContactTypeChartOptions();
    this.chartOptionsNotificationStatus = this.notificationStatusMetricService.getChartOptions();
    this.chartOptionsNotificationWeekly = this.weeklyMetricService.getChartOptions();
    this.chartOptionsSuscriptionRetention = this.weeklyMetricService.getChartOptions();
    this.chartOptionsSubscriptionOptionalAnalysis = this.subscriptionOptionalAnalysisMetricService.getChartOptions();


  }


  private destroy$ = new Subject<void>();

  chartDataContactType!: ChartData<'pie'>;
  chartOptionsContactType: ChartOptions<'pie'>;
  chartDataNotificationStatus!: ChartData<'pie'>;
  chartOptionsNotificationStatus: ChartOptions<'pie'>;
  chartDataNotificationWeekly!: ChartData<'bar'>;
  chartOptionsNotificationWeekly!: ChartOptions<'bar'>;
  chartDataSuscriptionRetention!: ChartData<'bar'>;
  chartOptionsSuscriptionRetention: ChartOptions<'bar'>;
  chartDataSubscriptionOptionalAnalysis!: ChartData<'bar'>;
  chartOptionsSubscriptionOptionalAnalysis: ChartOptions<'bar'>;

  today = new Date().toISOString().split('T')[0];
  isDropdownOpen = false;
  dateFrom: string | null = null;
  dateUntil: string | null = null;
  selectedStatus: 'ALL' | 'SENT' | 'VISUALIZED' = 'ALL';
  viewedRate: number = 0;
  viewedCount: number = 0;
  totalCount: number = 0;


  //END REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  notificationService = inject(NotificationService);
  iaService = inject(IaService);
  subscriptionService = inject(SubscriptionService);


  isModalOpen = false;
  modalTitle = '';
  modalMessage = '';


  retentionKPIs: RetentionKPIs = {
    averageRetention: 0,
    highestRetention: '',
    lowestRetention: '',
    subscriptionsAbove80: 0
  };


  isTooltipOpen = false;
  isLoading = false;
  iaResponse = '';
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  kpis!: KPIModel;

  notifications: NotificationKPIViewedModel[] = []

  getAllNotifications() {

    this.notificationService.getAllNotificationsNotFiltered().subscribe((data) => {

      this.notifications = data;

    })

  }


  ngOnInit() {

    this.getAllNotifications();
    this.notificationService.getAllNotificationsNotFiltered().subscribe((data) => {
      this.notifications = data;

      const today = new Date();
      this.dateFrom = this.formatDate(today);

      const tomorrow = new Date(today);
      today.setDate(today.getDate() + 2);
      tomorrow.setDate(today.getDate());
      this.dateUntil = this.formatDate(tomorrow);

      if (this.isBrowser) {
        this.calculateKPIs(data);
      }
    });

    //START REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW

    this.contactTypeMetricService.getContactTypeChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartDataContactType = data;
      });

    this.notificationStatusMetricService.loadNotifications();

    this.notificationStatusMetricService.getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartDataNotificationStatus = data;
      });

    this.weeklyMetricService.getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartDataNotificationWeekly = data;
      });

    this.subscriptionRetentionMetricService.getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartDataSuscriptionRetention = data;
      });

    this.subscriptionRetentionMetricService.loadData()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

      this.subscriptionOptionalAnalysisMetricService.getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartDataSubscriptionOptionalAnalysis = data;
      });

      this.kpiViewedRateService.getViewedStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.viewedRate = stats.viewedRate;
        this.viewedCount = stats.viewed;
        this.totalCount = stats.total;
      });

    this.loadData();

    //END REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW

  }



  //START REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  applyFilters(): void {
    this.notificationStatusMetricService.updateFilters({
      dateFrom: this.dateFrom,
      dateUntil: this.dateUntil,
      selectedStatus: this.selectedStatus
    });
    this.isDropdownOpen = false;
  }



  resetFilters(): void {
    this.dateFrom = null;
    this.dateUntil = null;
    this.selectedStatus = 'ALL';
    this.notificationStatusMetricService.resetFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateFrom'] || changes['dateUntil']) {
      this.updateDateFilter();
    }
  }

  private updateDateFilter(): void {
    this.kpiViewedRateService.updateDateFilter({
      dateFrom: this.dateFrom,
      dateUntil: this.dateUntil
    });
  }

  loadData(): void {
    this.kpiViewedRateService.loadNotificationStats();
  }

//END REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW REFACTOR NEW

  private calculateKPIs(data: any[]): void {
    const total = data.length;

    const sent = data.filter(n => n.statusSend === 'SENT').length;
    const pending = data.filter(n => n.statusSend === 'VISUALIZED').length;

    const uniqueDays = new Set(data.map(n => n.dateSend.split(' ')[0])).size;


    const hourCount = new Map<number, number>();
    data.forEach(n => {
      const hour = parseInt(n.dateSend.split(' ')[1].split(':')[0]);
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });

    const contactCount = new Map<string, number>();
    data.forEach(n => {
      contactCount.set(n.recipient, (contactCount.get(n.recipient) || 0) + 1);
    });

    const mostFrequentContact = Array.from(contactCount.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);

    const peakHour = Array.from(hourCount.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b, [0, 0]);

    const weekdayCount = new Map<string, number>();
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    data.forEach(notification => {
      const [day, month, year] = notification.dateSend.split(' ')[0].split('/');
      const date = new Date(year, month - 1, day);
      const weekday = weekdays[date.getDay()];
      weekdayCount.set(weekday, (weekdayCount.get(weekday) || 0) + 1);
    });

    let maxCount = 0;
    let mostActiveDay = '';

    weekdayCount.forEach((count, day) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDay = day;
      }
    });

    this.kpis = {
      pendingRate: (sent / total) * 100,
      viewedRate: (pending / total) * 100,
      dailyAverage: total / uniqueDays,
      peakHour: {
        hour: peakHour[0],
        count: peakHour[1]
      },
      mostFrequentContact: {
        email: mostFrequentContact[0],
        count: mostFrequentContact[1]
      },
      mostActiveDay: {
        day: mostActiveDay,
        count: maxCount,
        percentage: (maxCount / total) * 100
      }
    };
  }

  showInfo() {
    const message = '';

    this.showModal('Información', message);
  }

  showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }



  exportDashboardData(): string {
    const data = {
      kpis: this.kpis,
      notifications: this.notifications,
    };
    return JSON.stringify(data);
  }


  toggleTooltip() {
    this.isTooltipOpen = !this.isTooltipOpen;
    if (this.isTooltipOpen) {
      this.fetchIaResponse();
    }
  }

  fetchIaResponse() {
    console.log(this.exportDashboardData());
    this.isLoading = true; // Mostrar spinner
    this.iaService.analyzdeDashboard(this.exportDashboardData()).subscribe({
      next: (response) => {
        this.iaResponse = response; // Cambia según el formato de tu API
        this.isLoading = false; // Ocultar spinner
      },
      error: () => {
        this.iaResponse = 'Error al obtener respuesta del asistente.';
        this.isLoading = false;
      }
    });
  }





  private calculateRetentionKPIs(metrics: RetentionMetric[]): RetentionKPIs {
    return {
      averageRetention: metrics.reduce((acc, m) => acc + m.retentionRate, 0) / metrics.length,
      highestRetention: metrics[0].subscriptionName,
      lowestRetention: metrics[metrics.length - 1].subscriptionName,
      subscriptionsAbove80: metrics.filter(m => m.retentionRate > 80).length
    };
  }



}

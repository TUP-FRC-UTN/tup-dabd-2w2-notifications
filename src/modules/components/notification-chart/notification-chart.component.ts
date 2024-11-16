import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/services/notification.service';
import { ContactService } from '../../../app/services/contact.service';
import { NotificationModelChart } from '../../../app/models/notifications/notification';
import { ContactModel } from '../../../app/models/contacts/contactModel';
import { ChartConfigurationService } from '../../../app/services/dashboard/charts/chart-configuration.service';
import { KPIModel, RetentionKPIs, RetentionMetric } from '../../../app/models/kpi/kpiModel';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { IaService } from '../../../app/services/ia-service';
import { ChartData, ChartConfiguration, ChartOptions } from 'chart.js';
import { RouterModule } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { SubscriptionService } from '../../../app/services/subscription.service';
import { SubscriptionStat } from '../../../app/models/suscriptions/subscription'
import { ContactTypeMetricService } from '../../../app/services/dashboard/charts/contact-type-metric.service';
import { NotificationStatusMetricService } from '../../../app/services/dashboard/charts/notification-status-metric.service';
import { NotificationWeeklyMetricService } from '../../../app/services/dashboard/charts/notification-weekly-metric.service';


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

  constructor(
    private contactTypeMetricService: ContactTypeMetricService,
    private notificationStatusMetricService: NotificationStatusMetricService,
    private weeklyMetricService: NotificationWeeklyMetricService

  ) {

    this.chartOptionsContactType = this.contactTypeMetricService.getContactTypeChartOptions();
    this.chartOptionsNotificationStatus = this.notificationStatusMetricService.getChartOptions();
    this.chartOptionsNotificationWeekly = this.weeklyMetricService.getChartOptions();
  }



  private destroy$ = new Subject<void>();

  chartDataContactType!: ChartData<'pie'>;
  chartOptionsContactType: ChartOptions<'pie'>;
  chartDataNotificationStatus!: ChartData<'pie'>;
  chartOptionsNotificationStatus: ChartOptions<'pie'>;
  chartDataNotificationWeekly!: ChartData<'bar'>;
  chartOptionsNotificationWeekly!: ChartOptions<'bar'>;

  today = new Date().toISOString().split('T')[0];
  isDropdownOpen = false;
  dateFrom: string | null = null;
  dateUntil: string | null = null;
  selectedStatus: 'ALL' | 'SENT' | 'VISUALIZED' = 'ALL';

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  notificationService = inject(NotificationService);
  contactService = inject(ContactService);
  chartConfigurationService = inject(ChartConfigurationService);
  iaService = inject(IaService);
  subscriptionService = inject(SubscriptionService);


  searchSubject: string = '';
  searchEmail: string = '';
  recipientFilter: string = '';
  notificationSubjectFilter: string = '';

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

  notifications: NotificationModelChart[] = []
  contacts: ContactModel[] = []


  getAllNotifications() {

    this.notificationService.getAllNotificationsNotFiltered().subscribe((data) => {

      this.notifications = data;

    })

  }

  getAllContacts() {
    this.contactService.getAllContacts().subscribe((data) => {
      this.contacts = data;
    });
  }

  ngOnInit() {

    this.loadContactsAndSubscriptions();

    this.getAllContacts();
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


  }

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

  formatResponseTime(hours: number, minutes: number): string {
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  }





  subscriptionAnalysisData: ChartData = {
    labels: [], // Nombres de suscripciones
    datasets: [
      {
        data: [], // Cantidad de usuarios suscritos
        label: 'Suscritos',
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      },
      {
        data: [], // Cantidad de usuarios desuscritos
        label: 'Desuscritos',
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 1
      }
    ]
  };

  subscriptionAnalysisOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Análisis de Suscripciones Opcionales'
      }
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: true
        },
        title: {
          display: true,
          text: 'Cantidad de Usuarios'
        },
        border: {
          display: true
        }
      },
      y: {
        stacked: false,
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Tipos de Suscripción'
        },
        border: {
          display: true
        }
      }
    },
    maintainAspectRatio: false
  };






  // Método para procesar los datos
  processSubscriptionData(contacts: any[], subscriptionTypes: any[]) {
    // Filtrar solo las suscripciones opcionales
    const optionalSubs = subscriptionTypes
      .filter(sub => sub.isUnsubscribable)
      .map(sub => sub.name);

    const subscriptionStats: Record<string, SubscriptionStat> = optionalSubs.reduce((acc, subName) => {
      acc[subName] = { subscribed: 0, unsubscribed: 0, total: contacts.length };
      return acc;
    }, {} as Record<string, SubscriptionStat>);

    // Ahora el sort estará correctamente tipado
    const sortedStats = Object.entries(subscriptionStats)
      .sort(([, a], [, b]) => b.subscribed - a.subscribed);


    // Contar suscripciones
    contacts.forEach(contact => {
      optionalSubs.forEach(subName => {
        if (contact.subscriptions.includes(subName)) {
          subscriptionStats[subName].subscribed++;
        } else {
          subscriptionStats[subName].unsubscribed++;
        }
      });
    });

    // Actualizar datos del gráfico
    this.subscriptionAnalysisData.labels = sortedStats.map(([name]) => name);
    this.subscriptionAnalysisData.datasets[0].data = sortedStats.map(([, stats]) => stats.subscribed);
    this.subscriptionAnalysisData.datasets[1].data = sortedStats.map(([, stats]) => stats.unsubscribed);
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

  loadContactsAndSubscriptions(): void {
    forkJoin({
      subscriptionTypes: this.subscriptionService.getAllSubscriptions(),
      contacts: this.contactService.getAllContacts()
    }).subscribe({
      next: ({ subscriptionTypes, contacts }) => {
        // Actualizar gráfico de tasa de retención (verde)
        const retentionMetrics = this.calculateRetentionMetrics(contacts, subscriptionTypes);
        this.retentionChartData = {
          labels: retentionMetrics.map(m => this.subscriptionService.getSubscriptionNameInSpanish(m.subscriptionName)),
          datasets: [{
            data: retentionMetrics.map(m => m.retentionRate),
            label: 'Tasa de Retención (%)',
            backgroundColor: 'rgba(98, 182, 143, 1)',
            borderColor: 'rgba(98, 182, 143, 1)',
            borderWidth: 1
          }]
        };

        // Actualizar gráfico de análisis (azul/rojo)
        const analysisMetrics = this.calculateSubscriptionAnalysis(contacts, subscriptionTypes);
        this.subscriptionAnalysisData = {
          labels: analysisMetrics.map(m => this.subscriptionService.getSubscriptionNameInSpanish(m.subscriptionName)),
          datasets: [
            {
              data: analysisMetrics.map(m => m.subscribed),
              label: 'Suscritos',
              backgroundColor: 'rgba(130, 177, 255, 1)',
              borderColor: 'rgba(130, 177, 255, 1)',
              borderWidth: 1
            },
            {
              data: analysisMetrics.map(m => m.unsubscribed),
              label: 'Desuscritos',
              backgroundColor: 'rgba(255, 145, 158, 1)',
              borderColor: 'rgba(255, 145, 158, 1)',
              borderWidth: 1
            }
          ]
        };
      },
      error: (error) => {
        console.error('Error loading contacts and subscriptions:', error);
      }
    });
  }

  private calculateRetentionMetrics(contacts: any[], subscriptionTypes: any[]): RetentionMetric[] {
    // Solo para suscripciones opcionales
    const optionalSubs = subscriptionTypes
      .filter(sub => sub.isUnsubscribable)
      .map(sub => sub.name);

    const totalUsers = contacts.length;

    return optionalSubs.map(subName => {
      const activeUsers = contacts.filter(contact =>
        contact.subscriptions.includes(subName)
      ).length;

      return {
        subscriptionName: subName,
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        retentionRate: (activeUsers / totalUsers) * 100
      };
    });
  }


  retentionChartData: ChartData = {
    labels: [], // Nombres de suscripciones
    datasets: [{
      data: [], // Porcentajes de retención
      label: 'Tasa de Retención (%)',
      backgroundColor: '#4CAF50', // Verde
      borderColor: '#4CAF50',
      borderWidth: 1
    }]
  };

  retentionChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Tasa de Retención de Notificaciones Opcionales'
      }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje de Retención'
        }
      }
    }
  };

  private updateRetentionChart(metrics: any[]) {
    this.retentionChartData = {
      labels: metrics.map(m => this.subscriptionService.getSubscriptionNameInSpanish(m.subscriptionName)),
      datasets: [{
        data: metrics.map(m => m.retentionRate),
        label: 'Tasa de Retención (%)',
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1
      }]
    };
  }

  private calculateRetentionKPIs(metrics: RetentionMetric[]): RetentionKPIs {
    return {
      averageRetention: metrics.reduce((acc, m) => acc + m.retentionRate, 0) / metrics.length,
      highestRetention: metrics[0].subscriptionName,
      lowestRetention: metrics[metrics.length - 1].subscriptionName,
      subscriptionsAbove80: metrics.filter(m => m.retentionRate > 80).length
    };
  }

  processRetentionData(contacts: any[], subscriptionTypes: any[]) {
    // Para los KPIs y el gráfico de tasa de retención (verde)
    const retentionMetrics = this.calculateRetentionMetrics(contacts, subscriptionTypes);
    this.retentionKPIs = this.calculateRetentionKPIs(retentionMetrics);
    this.updateRetentionChart(retentionMetrics);

    // Para el gráfico de análisis (azul/rojo)
    const analysisMetrics = this.calculateSubscriptionAnalysis(contacts, subscriptionTypes);
    this.updateSubscriptionAnalysisChart(analysisMetrics);
  }

  private calculateSubscriptionAnalysis(contacts: any[], subscriptionTypes: any[]) {
    const optionalSubs = subscriptionTypes
      .filter(sub => sub.isUnsubscribable)
      .map(sub => sub.name);

    return optionalSubs.map(subName => {
      const subscribedUsers = contacts.filter(contact =>
        contact.subscriptions.includes(subName)
      ).length;

      return {
        subscriptionName: subName,
        subscribed: subscribedUsers,
        unsubscribed: contacts.length - subscribedUsers
      };
    });
  }

  private updateSubscriptionAnalysisChart(metrics: any[]) {
    this.subscriptionAnalysisData = {
      labels: metrics.map(m => this.subscriptionService.getSubscriptionNameInSpanish(m.subscriptionName)),
      datasets: [
        {
          data: metrics.map(m => m.subscribed),
          label: 'Suscritos',
          backgroundColor: '#36A2EB',
          borderColor: '#36A2EB',
          borderWidth: 1
        },
        {
          data: metrics.map(m => m.unsubscribed),
          label: 'Desuscritos',
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
          borderWidth: 1
        }
      ]
    };
  }
}

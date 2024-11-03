import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/services/notification.service';
import { NotificationModelChart } from '../../../app/models/notifications/notification';
import { ChartConfigurationService } from '../../../app/services/chart-configuration.service';
import { KPIModel } from '../../../app/models/kpi/kpiModel';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MainContainerComponent } from 'ngx-dabd-grupo01';


@Component({
  selector: 'app-notification-chart',
  standalone: true,
  imports: [
    NgChartsModule,
    FormsModule,
    CommonModule,
    MainContainerComponent
  ],
  templateUrl: './notification-chart.component.html',
  styleUrl: './notification-chart.component.css'
})


export class NotificationChartComponent implements OnInit {

  @ViewChild('statusChart') statusChart?: BaseChartDirective;
  @ViewChild('templateChart') templateChart?: BaseChartDirective;
  @ViewChild('dailyChart') dailyChart?: BaseChartDirective;

  private platformId = inject(PLATFORM_ID);
  notificationService = inject(NotificationService);
  chartConfigurationService = inject(ChartConfigurationService);
  isBrowser = isPlatformBrowser(this.platformId);


  dateFrom: string = '';
  dateUntil: string = '';
  searchSubject: string = '';
  searchEmail: string = '';
  selectedStatus: 'ALL' | 'SENT' | 'VISUALIZED' = 'ALL';
  statusFilter: string = '';
  recipientFilter: string = '';
  notificationSubjectFilter: string = '';
  isDropdownOpen = false;

  statusChartData = this.chartConfigurationService.statusChartData;
  templateChartData = this.chartConfigurationService.templateChartData;
  dailyChartData = this.chartConfigurationService.dailyChartData;
  statusChartOptions = this.chartConfigurationService.statusChartOptions;
  templateChartOptions = this.chartConfigurationService.templateChartOptions;
  dailyChartOptions = this.chartConfigurationService.dailyChartOptions;


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  kpis!: KPIModel;

  notifications: NotificationModelChart[] = []

  ngOnInit() {

    this.getAllNotifications();

    if (this.isBrowser) {
      this.filterAndUpdateCharts();
    }

  }


  getAllNotifications() {

    this.notificationService.getAllNotificationsNotFiltered().subscribe((data) => {

      this.notifications = data;

    })

  }


  applyFilters() {
    this.filterAndUpdateCharts();
    this.isDropdownOpen = false;
  }


  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchSubject) count++;
    if (this.searchEmail) count++;
    if (this.selectedStatus !== 'ALL') count++;
    if (this.dateFrom) count++;
    if (this.dateUntil) count++;
    return count;
  }

  resetFilters() {
    this.searchSubject = '';
    this.searchEmail = '';
    this.selectedStatus = 'ALL';
    this.dateFrom = '';
    this.dateUntil = '';
    this.filterAndUpdateCharts();
  }

  private filterAndUpdateCharts(): void {

    let filteredData = [...this.notifications];

    if (this.searchSubject) {
      filteredData = filteredData.filter(notification =>
        notification.subject.toLowerCase().includes(this.searchSubject.toLowerCase())
      );
    }

    if (this.searchEmail) {
      filteredData = filteredData.filter(notification =>
        notification.recipient.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filteredData = filteredData.filter(notification =>
        notification.statusSend === this.selectedStatus
      );
    }

    if (this.dateFrom || this.dateUntil) {
      filteredData = this.notifications.filter(notification => {
        const notificationDate = new Date(this.convertToISODate(notification.dateSend));
        const fromDate = this.dateFrom ? new Date(this.dateFrom) : null;
        const untilDate = this.dateUntil ? new Date(this.dateUntil) : null;

        return (!fromDate || notificationDate >= fromDate) &&
          (!untilDate || notificationDate <= untilDate);
      });
    }

    this.updateChartsWithData(filteredData);
  }

  private convertToISODate(dateString: string): string {
    const [date, time] = dateString.split(' ');
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}T${time}`;
  }

  private updateChartsWithData(data: any[]): void {

    const statusCount = {
      SENT: 0,
      VISUALIZED: 0
    };

    data.forEach(notification => {
      statusCount[notification.statusSend as keyof typeof statusCount]++;
    });

    this.statusChartData = {
      ...this.chartConfigurationService.statusChartData,
      datasets: [{
        ...this.chartConfigurationService.statusChartData.datasets[0],
        data: [statusCount.SENT, statusCount.VISUALIZED]
      }]
    };


    const templateCount = new Map<string, number>();
    data.forEach(notification => {
      const count = templateCount.get(notification.templateName) || 0;
      templateCount.set(notification.templateName, count + 1);
    });

    this.templateChartData = {
      labels: Array.from(templateCount.keys()),
      datasets: [{
        data: Array.from(templateCount.values()),
        label: 'Cantidad de Usos',
        backgroundColor: '#36A2EB'
      }]
    };

    const dailyCount = new Map<string, number>();
    data.forEach(notification => {
      const date = notification.dateSend.split(' ')[0];
      const count = dailyCount.get(date) || 0;
      dailyCount.set(date, count + 1);
    });

    const sortedDates = Array.from(dailyCount.keys()).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      return new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime();
    });

    this.dailyChartData = {
      labels: sortedDates,
      datasets: [{
        data: sortedDates.map(date => dailyCount.get(date) || 0),
        label: 'Notificaciones Enviadas',
        fill: false,
        tension: 0.1,
        borderColor: '#36A2EB'
      }]
    };

    setTimeout(() => {
      this.statusChart?.update();
      this.templateChart?.update();
      this.dailyChart?.update();
    });

    this.calculateKPIs(data);
  }


  private calculateKPIs(data: any[]): void {

    const total = data.length;

    const sent = data.filter(n => n.statusSend === 'SENT').length;
    const pending = data.filter(n => n.statusSend === 'VISUALIZED').length;

    const uniqueDays = new Set(data.map(n => n.dateSend.split(' ')[0])).size;

    const templateCount = new Map<string, number>();

    data.forEach(n => {
      templateCount.set(n.templateName, (templateCount.get(n.templateName) || 0) + 1);
    });
    const mostUsedTemplate = Array.from(templateCount.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);

    const hourCount = new Map<number, number>();
    data.forEach(n => {
      const hour = parseInt(n.dateSend.split(' ')[1].split(':')[0]);
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });

    const peakHour = Array.from(hourCount.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b, [0, 0]);

    this.kpis = {
      successRate: (sent / total) * 100,
      pendingRate: (pending / total) * 100,
      dailyAverage: total / uniqueDays,
      mostUsedTemplate: {
        name: mostUsedTemplate[0],
        count: mostUsedTemplate[1]
      },
      peakHour: {
        hour: peakHour[0],
        count: peakHour[1]
      }
    };
  }

  showInfo() {
    const message = `
      <strong>Sistema de control de notificaciones</strong><br>
      Aquí puedes visualizar todos las notificaciones del sistema.<br><br>
      <strong>Iconografía:</strong><br>
      Visto: <i class="bi bi-check2-circle text-success large-icon"></i><br>
      No visto: <i class="bi bi-x-circle text-danger large-icon"></i><br>
      Ver: <i class="bi bi-eye text-info" style="font-size: 1.3rem; color:info"></i>
    `;

  }


}

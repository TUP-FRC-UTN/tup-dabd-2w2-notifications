import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/services/notification.service';
import { NotificationModelChart } from '../../../app/models/notifications/notification';
import { ChartConfigurationService } from '../../../app/services/chart-configuration.service';
import { KPIModel } from '../../../app/models/kpi/kpiModel';



@Component({
  selector: 'app-notification-chart',
  standalone: true,
  imports: [
    NgChartsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './notification-chart.component.html',
  styleUrl: './notification-chart.component.css'
})


export class NotificationChartComponent implements OnInit {

  @ViewChild('statusChart') statusChart?: BaseChartDirective;
  @ViewChild('templateChart') templateChart?: BaseChartDirective;
  @ViewChild('dailyChart') dailyChart?: BaseChartDirective;

  notificationService = inject(NotificationService);
  chartConfigurationService = inject(ChartConfigurationService);

  dateFrom: string = '';
  dateUntil: string = '';
  statusChartData = this.chartConfigurationService.statusChartData;
  templateChartData = this.chartConfigurationService.templateChartData;
  dailyChartData = this.chartConfigurationService.dailyChartData;
  statusChartOptions = this.chartConfigurationService.statusChartOptions;
  templateChartOptions = this.chartConfigurationService.templateChartOptions;
  dailyChartOptions = this.chartConfigurationService.dailyChartOptions;

  kpis!: KPIModel;

  notifications: NotificationModelChart[] = []


  ngOnInit() {

    this.getAllNotifications();

    this.filterAndUpdateCharts();
  }


  getAllNotifications() {

    this.notificationService.getAllNotificationsNotFiltered().subscribe((data) => {

      this.notifications = data;

    })

  }



  filterNotifications() {
    this.filterAndUpdateCharts();
  }

  resetFilters() {
    this.dateFrom = '';
    this.dateUntil = '';
    this.filterAndUpdateCharts();
  }

  private filterAndUpdateCharts(): void {

    let filteredData = [...this.notifications];

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


}

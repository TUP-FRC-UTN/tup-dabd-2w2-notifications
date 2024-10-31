import { Component, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';

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

  dateFrom: string = '';
  dateUntil: string = '';

  // Mock data
  private notificationsMock = [
    {
      id: 1,
      recipient: "salviagui@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "30/10/2024 19:23:56",
      statusSend: "SENT"
    },
    {
      id: 2,
      recipient: "usuario1@gmail.com",
      subject: "Recuperación de contraseña",
      templateId: 2,
      templateName: "Password Reset",
      dateSend: "30/10/2024 15:45:23",
      statusSend: "FAILED"
    },
    {
      id: 3,
      recipient: "usuario2@gmail.com",
      subject: "Confirmación de compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "29/10/2024 09:12:34",
      statusSend: "SENT"
    },
    {
      id: 4,
      recipient: "usuario3@gmail.com",
      subject: "Notificación de envío",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "29/10/2024 14:23:11",
      statusSend: "PENDING"
    },
    {
      id: 5,
      recipient: "usuario4@gmail.com",
      subject: "Actualización de términos",
      templateId: 4,
      templateName: "Terms Update",
      dateSend: "28/10/2024 11:45:00",
      statusSend: "SENT"
    }
  ];

  // Chart configurations
  public commonOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  // Status Chart (Pie)
  public statusChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Enviados', 'Fallidos', 'Pendientes'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
    }]
  };

  public statusChartOptions: ChartConfiguration['options'] = {
    ...this.commonOptions,
    plugins: {
      ...this.commonOptions?.plugins,
      title: {
        display: true,
        text: 'Estado de Notificaciones'
      }
    }
  };

  // Template Usage Chart (Bar)
  public templateChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Cantidad de Usos',
      backgroundColor: '#36A2EB'
    }]
  };

  public templateChartOptions: ChartConfiguration['options'] = {
    ...this.commonOptions,
    plugins: {
      ...this.commonOptions?.plugins,
      title: {
        display: true,
        text: 'Uso de Plantillas'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  // Daily Notifications Chart (Line)
  public dailyChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Notificaciones Enviadas',
      fill: false,
      tension: 0.1,
      borderColor: '#36A2EB'
    }]
  };

  public dailyChartOptions: ChartConfiguration['options'] = {
    ...this.commonOptions,
    plugins: {
      ...this.commonOptions?.plugins,
      title: {
        display: true,
        text: 'Notificaciones por Día'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  ngOnInit() {
    this.filterAndUpdateCharts();
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
    let filteredData = [...this.notificationsMock];

    if (this.dateFrom || this.dateUntil) {
      filteredData = this.notificationsMock.filter(notification => {
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
    // Update Status Chart
    const statusCount = {
      SENT: 0,
      FAILED: 0,
      PENDING: 0
    };

    data.forEach(notification => {
      statusCount[notification.statusSend as keyof typeof statusCount]++;
    });

    this.statusChartData = {
      labels: ['Enviados', 'Fallidos', 'Pendientes'],
      datasets: [{
        data: [statusCount.SENT, statusCount.FAILED, statusCount.PENDING],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
      }]
    };

    // Update Template Chart
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

    // Update Daily Chart
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
  }
}

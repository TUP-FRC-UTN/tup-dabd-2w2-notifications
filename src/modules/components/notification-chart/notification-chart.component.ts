import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NotificationService } from '../../../app/services/notification.service';
import { Notification, NotificationMock } from '../../../app/models/notifications/notification';


interface KPIMetrics {
  successRate: number;
  failureRate: number;
  pendingRate: number;
  dailyAverage: number;
  mostUsedTemplate: {
    name: string;
    count: number;
  };
  peakHour: {
    hour: number;
    count: number;
  };
}

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



  notificationService = inject(NotificationService)



  kpis!: KPIMetrics;


  notifications: NotificationMock[] = [
    {
      id: 1,
      recipient: "user1@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "01/10/2024 09:27:08",
      statusSend: 'SENT'
    },
    {
      id: 2,
      recipient: "user2@gmail.com",
      subject: "Recuperación de Contraseña",
      templateId: 2,
      templateName: "Password Reset",
      dateSend: "01/10/2024 14:15:23",
      statusSend: 'SENT'
    },
    {
      id: 3,
      recipient: "user3@gmail.com",
      subject: "Confirmación de Compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "01/10/2024 11:30:45",
      statusSend: 'SENT'
    },
    {
      id: 4,
      recipient: "user4@gmail.com",
      subject: "Notificación de Envío",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "03/10/2024 16:45:12",
      statusSend: 'PENDING'
    },
    {
      id: 5,
      recipient: "user5@gmail.com",
      subject: "Actualización de Términos",
      templateId: 4,
      templateName: "Terms Update",
      dateSend: "05/10/2024 10:20:33",
      statusSend: 'SENT'
    },
    {
      id: 6,
      recipient: "user6@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "07/10/2024 13:55:18",
      statusSend: 'SENT'
    },
    {
      id: 7,
      recipient: "user7@gmail.com",
      subject: "Confirmación de Compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "10/10/2024 08:40:29",
      statusSend: 'FAILED'
    },
    {
      id: 8,
      recipient: "user8@gmail.com",
      subject: "Notificación de Envío",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "12/10/2024 15:33:42",
      statusSend: 'SENT'
    },
    {
      id: 9,
      recipient: "user9@gmail.com",
      subject: "Recuperación de Contraseña",
      templateId: 2,
      templateName: "Password Reset",
      dateSend: "15/10/2024 09:15:51",
      statusSend: 'PENDING'
    },
    {
      id: 10,
      recipient: "user10@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "18/10/2024 14:22:37",
      statusSend: 'SENT'
    },
    {
      id: 11,
      recipient: "user11@gmail.com",
      subject: "Actualización de Términos",
      templateId: 4,
      templateName: "Terms Update",
      dateSend: "20/10/2024 11:48:55",
      statusSend: 'SENT'
    },
    {
      id: 12,
      recipient: "user12@gmail.com",
      subject: "Confirmación de Compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "22/10/2024 16:30:14",
      statusSend: 'FAILED'
    },
    {
      id: 13,
      recipient: "user13@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "25/10/2024 10:05:33",
      statusSend: 'SENT'
    },
    {
      id: 14,
      recipient: "user14@gmail.com",
      subject: "Notificación de Envío",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "25/10/2024 13:42:19",
      statusSend: 'SENT'
    },
    {
      id: 15,
      recipient: "user15@gmail.com",
      subject: "Recuperación de Contraseña",
      templateId: 2,
      templateName: "Password Reset",
      dateSend: "31/10/2024 15:18:47",
      statusSend: 'SENT'
    },
    {
      id: 16,
      recipient: "user16@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "01/11/2024 09:33:22",
      statusSend: 'SENT'
    },
    {
      id: 17,
      recipient: "user17@gmail.com",
      subject: "Confirmación de Compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "03/11/2024 14:55:38",
      statusSend: 'FAILED'
    },
    {
      id: 18,
      recipient: "user18@gmail.com",
      subject: "Actualización de Términos",
      templateId: 4,
      templateName: "Terms Update",
      dateSend: "05/11/2024 11:27:45",
      statusSend: 'SENT'
    },
    {
      id: 19,
      recipient: "user19@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "08/11/2024 16:40:12",
      statusSend: 'PENDING'
    },
    {
      id: 20,
      recipient: "user20@gmail.com",
      subject: "Notificación de Envío",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "10/11/2024 10:15:29",
      statusSend: 'SENT'
    },
    {
      id: 21,
      recipient: "user21@gmail.com",
      subject: "Recuperación de Contraseña",
      templateId: 2,
      templateName: "Password Reset",
      dateSend: "12/11/2024 13:50:55",
      statusSend: 'FAILED'
    },
    {
      id: 22,
      recipient: "user22@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "15/11/2024 15:22:33",
      statusSend: 'SENT'
    },
    {
      id: 23,
      recipient: "user23@gmail.com",
      subject: "Confirmación de Compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "18/11/2024 09:45:18",
      statusSend: 'SENT'
    },
    {
      id: 24,
      recipient: "user24@gmail.com",
      subject: "Actualización de Términos",
      templateId: 4,
      templateName: "Terms Update",
      dateSend: "20/11/2024 14:30:42",
      statusSend: 'PENDING'
    },
    {
      id: 25,
      recipient: "user25@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "22/11/2024 11:18:27",
      statusSend: 'SENT'
    },
    {
      id: 26,
      recipient: "user26@gmail.com",
      subject: "Notificación de Envío",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "25/11/2024 16:55:33",
      statusSend: 'FAILED'
    },
    {
      id: 27,
      recipient: "user27@gmail.com",
      subject: "Recuperación de Contraseña",
      templateId: 2,
      templateName: "Password Reset",
      dateSend: "27/11/2024 10:40:15",
      statusSend: 'SENT'
    },
    {
      id: 28,
      recipient: "user28@gmail.com",
      subject: "Confirmación de Compra",
      templateId: 3,
      templateName: "Purchase Confirmation",
      dateSend: "29/11/2024 13:25:48",
      statusSend: 'SENT'
    },
    {
      id: 29,
      recipient: "user29@gmail.com",
      subject: "Bienvenida",
      templateId: 1,
      templateName: "Welcome Email",
      dateSend: "30/11/2024 15:50:22",
      statusSend: 'PENDING'
    },
    {
      id: 30,
      recipient: "user30@gmail.com",
      subject: "Actualización de Términos",
      templateId: 4,
      templateName: "Terms Update",
      dateSend: "30/11/2024 09:15:37",
      statusSend: 'SENT'
    }
  ];



  getAllNotifications() {


    this.notificationService.getAllNotificationsNotFiltered().subscribe((data) => {

      this.notifications = data;

    })

  }


  // // Mock data
  // private notifications = [
  //   {
  //     id: 1,
  //     recipient: "salviagui@gmail.com",
  //     subject: "Bienvenida",
  //     templateId: 1,
  //     templateName: "Welcome Email",
  //     dateSend: "30/10/2024 19:23:56",
  //     statusSend: "'SENT'"




  //   },
  //   {
  //     id: 2,
  //     recipient: "usuario1@gmail.com",
  //     subject: "Recuperación de contraseña",
  //     templateId: 2,
  //     templateName: "Password Reset",
  //     dateSend: "30/10/2024 15:45:23",
  //     statusSend: "FAILED"
  //   },
  //   {
  //     id: 3,
  //     recipient: "usuario2@gmail.com",
  //     subject: "Confirmación de compra",
  //     templateId: 3,
  //     templateName: "Purchase Confirmation",
  //     dateSend: "29/10/2024 09:12:34",
  //     statusSend: "'SENT'"
  //   },
  //   {
  //     id: 4,
  //     recipient: "usuario3@gmail.com",
  //     subject: "Notificación de envío",
  //     templateId: 1,
  //     templateName: "Welcome Email",
  //     dateSend: "29/10/2024 14:23:11",
  //     statusSend: "PENDING"
  //   },
  //   {
  //     id: 5,
  //     recipient: "usuario4@gmail.com",
  //     subject: "Actualización de términos",
  //     templateId: 4,
  //     templateName: "Terms Update",
  //     dateSend: "28/10/2024 11:45:00",
  //     statusSend: "'SENT'"
  //   }
  // ];

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

  public statusChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Enviados', 'Fallidos', 'No Leída'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
    }]
  };

 // Status Chart (Pie)
public statusChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    title: {
      display: false
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 4,
          precision: 0
        },
        grid: {
          color: '#e9ecef'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

// Daily Chart (Line)
public dailyChartData: ChartConfiguration<'line'>['data'] = {
  labels: [],
  datasets: [{
    data: [],
    label: 'Notificaciones Enviadas',
    fill: false,
    tension: 0.1,
    borderColor: '#36A2EB',
    backgroundColor: '#36A2EB',
    pointBackgroundColor: '#36A2EB',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#36A2EB'
  }]
};

public dailyChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0
      },
      grid: {
        color: '#e9ecef'
      }
    },
    x: {
      grid: {
        color: '#e9ecef'
      }
    }
  }
};


  ngOnInit() {

    /*this.getAllNotifications();*/

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
    let filteredData = [...this.notifications];

    if (this.dateFrom || this.dateUntil) {
      filteredData = this.notifications.filter(notification => {
        const notificationDate = new Date(this.convertToISODate(notification.dateSend.toLocaleString()));
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
      ['NO LEIDA']: 0
    };

    data.forEach(notification => {
      statusCount[notification.statusSend as keyof typeof statusCount]++;
    });

    this.statusChartData = {
      labels: ['Enviados', 'Fallidos', 'No Leida'],
      datasets: [{
        data: [statusCount.SENT, statusCount.FAILED, statusCount['NO LEIDA']],
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

    this.calculateKPIs(data);
  }


  private calculateKPIs(data: any[]): void {
    const total = data.length;

    // Tasas de estado
    const sent = data.filter(n => n.statusSend === 'SENT').length;
    const failed = data.filter(n => n.statusSend === 'FAILED').length;
    const pending = data.filter(n => n.statusSend === 'PENDING').length;

    // Promedio diario
    const uniqueDays = new Set(data.map(n => n.dateSend.split(' ')[0])).size;

    // Plantilla más usada
    const templateCount = new Map<string, number>();
    data.forEach(n => {
      templateCount.set(n.templateName, (templateCount.get(n.templateName) || 0) + 1);
    });
    const mostUsedTemplate = Array.from(templateCount.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);

    // Hora pico
    const hourCount = new Map<number, number>();
    data.forEach(n => {
      const hour = parseInt(n.dateSend.split(' ')[1].split(':')[0]);
      hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
    });
    const peakHour = Array.from(hourCount.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b, [0, 0]);

    this.kpis = {
      successRate: (sent / total) * 100,
      failureRate: (failed / total) * 100,
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

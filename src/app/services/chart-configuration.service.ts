import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigurationService {

  private readonly defaultPieChartOptions: ChartOptions<'pie'> = {
    // Hace que el gráfico sea responsive
    responsive: true,

    // Permite que el gráfico ajuste su tamaño sin mantener la relación de aspecto
    maintainAspectRatio: false,

    // Configuración de plugins (legend, tooltip, etc)
    plugins: {
      // Configuración de la leyenda
      legend: {
        // Posición de la leyenda ('top', 'left', 'bottom', 'right')
        position: 'bottom',
        labels: {
          // Usa puntos en lugar de rectángulos en la leyenda
          usePointStyle: true,
          // Espaciado entre elementos de la leyenda
          padding: 20,
          font: {
            size: 12 // Tamaño de la fuente
          }
        }
      },

      // Configuración del título
      title: {
        display: false // No mostrar título
      },

      // Configuración del tooltip (el popup que aparece al hacer hover)
      tooltip: {
        enabled: true,
        callbacks: {
          // Personaliza el texto que aparece en el tooltip
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          }
        }
      }
    },

    // Configuración de animaciones
    animation: {
      animateScale: true,  // Anima el escalado del gráfico
      animateRotate: true  // Anima la rotación del gráfico
    }
  };


  getPieChartOptions(customOptions?: Partial<ChartOptions<'pie'>>): ChartOptions<'pie'> {
    return {
      ...this.defaultPieChartOptions,
      ...customOptions
    };
  }

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
    labels: ['Enviados', 'Visualizados' /*, 'No Leída'*/],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
    }]
  };


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


  getContactTypeChartOptions(): ChartOptions<'pie'> {
    return this.getPieChartOptions({
      plugins: {
        ...this.defaultPieChartOptions.plugins,
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              const percentage = ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    });
  }




}

export interface KPIModel {
  successRate: number;
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

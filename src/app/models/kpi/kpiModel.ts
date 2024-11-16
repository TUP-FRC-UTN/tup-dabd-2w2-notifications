export interface KPIModel {
  pendingRate: number;
  viewedRate: number;
  dailyAverage: number;
  peakHour: {
    hour: number;
    count: number;
  };
  mostFrequentContact: {
    email: string;
    count: number;
  };
  mostActiveDay: {
    day: string;
    count: number;
    percentage: number;
  };



}

export interface RetentionMetric {
  subscriptionName: string;
  totalUsers: number;
  activeUsers: number;
  retentionRate: number;
}


export interface RetentionKPIs {
  averageRetention: number;
  highestRetention: string;
  lowestRetention: string;
  subscriptionsAbove80: number;
}


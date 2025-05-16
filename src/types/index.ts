// src/types/index.ts
export interface TouristSpot {
    poi_id: string;
    poi_name: string;
    congestion: number;
    congestion_level: number;
    visitor_count: number;
    biz_cat_name: string;
    address: string;
    past_data: PastData[];
    forecast_data: ForecastData[];
    weather: Weather;
}

export interface PastData {
    visit_date: string;
    approx_visitor_count: number;
    congestion: number;
}

export interface ForecastData {
    forecast_date: string;
    predicted_congestion: number;
}

export interface Weather {
    tempmax: number;
    tempmin: number;
    conditions: string;
    humidity: number;
}

export interface CrowdLevel {
    level: string;
    color: string;
}

export interface ChartData {
    day: string;
    [key: string]: string | number;
}
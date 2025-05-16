export interface PlaceListRequestDto {
    sortBy?: 'poi_id' | 'poi_name' | 'visitor_count' | 'congestion_level';
    sortDirection?: 'asc' | 'desc';
    limit?: number;
}

export interface PlaceSummaryDto {
    poiId: string;
    poiName: string;
    categoryName: string;
    visitorCount: number;
    congestionLevel: number;
}
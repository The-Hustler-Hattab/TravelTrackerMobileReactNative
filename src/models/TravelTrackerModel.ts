

interface TravelTrackerModel {
    ID: number;
    CreatedAt: string| null;
    CreatedBy: string;
    EstimatedTaxDeductions: number;
    TravelDistance: number;
    TravelFrom: string;
    TravelTo: string;
    TravelTime: string;
    Comment: string;
}

export default TravelTrackerModel;
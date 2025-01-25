import ApiConstants from "../constants/AppApiConstants";
import IrsMilageRate from "../models/IrsMilageRate";
import TravelTrackerModel from "../models/TravelTrackerModel";



class APIUtil {



    public static async  getAllTravelTrackerRecords(jwt: string): Promise<TravelTrackerModel[]> {
        const url = `${ApiConstants.TRAVEL_TRACKER_API_URL}travel-tracker`;
        
        
        const response = await  fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${jwt}`,
            },
        }) ;
        
        const data = await response.json();
        return data as TravelTrackerModel[]; // Ensure this matches the expected shape
    }


    public static async  deleteTravelTrackerRecordById(jwt: string, id: number ): Promise<Response> {
        const url = `${ApiConstants.TRAVEL_TRACKER_API_URL}travel-tracker/${id}`;
        
        
        const response = await  fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${jwt}`,
            },
        }) ;
        
        return response; // Ensure this matches the expected shape
    }

    public static async createTravelTrackerRecord(jwt: string, travelRecord: TravelTrackerModel ):
     Promise<Response> {
        const url = `${ApiConstants.TRAVEL_TRACKER_API_URL}travel-tracker`;
        console.log("Creating travel record: "+ JSON.stringify(travelRecord));
        
        
        const response = await  fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify(travelRecord)
        }) ;
        
        return response; // Ensure this matches the expected shape
    }





    public static async  getIrsMilageRateByYear(jwt: string, year: number): Promise<IrsMilageRate> {
        const url = `${ApiConstants.TRAVEL_TRACKER_API_URL}mileage/${year}`;
        
        
        const response = await  fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${jwt}`,
            },
        }) ;
        
        const data = await response.json();
        return data as IrsMilageRate // Ensure this matches the expected shape
    }



    public static async  getApiKey(jwt: string): Promise<{ apiKey: string }> {
        const url = `${ApiConstants.TRAVEL_TRACKER_API_URL}api-key`;
        
        
        const response = await  fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${jwt}`,
            },
        }) ;
        
        const data = await response.json();
        return data as { apiKey: string }; // Ensure this matches the expected shape
    }




}

export default APIUtil;
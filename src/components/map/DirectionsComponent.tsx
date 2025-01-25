import React from "react";
import { Alert } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import ColorConstants from "../../constants/ColorConstants";
import ApiConstants from "../../constants/AppApiConstants";
import MapView from "react-native-maps";
import ConversionUtil from "../../utils/ConversionUtil";
import { useAuth } from "../../contexts/AuthContext";
// import { useTheme } from "../contexts/ThemeContextProps";

interface DirectionsComponentProps {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  mapRef: React.RefObject<MapView>;
  setTravelTimeAndDistance(timeMinutes: number, distance: number): void;

}

function DirectionsComponent({
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude,
  mapRef,
  setTravelTimeAndDistance,
}: DirectionsComponentProps): JSX.Element {
  //   const { theme } = useTheme();

    const { googleApiKey } = useAuth();
  

  function adjustMapViewForRoute(
    originLatitude: number,
    originLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
  ): void {

    if (
      mapRef.current &&
      originLatitude &&
      originLongitude &&
      destinationLatitude &&
      destinationLongitude
    ) {
    
        console.log("Adjusting map view for route");
        
      mapRef.current.fitToCoordinates(
        [
          { latitude: originLatitude, longitude: originLongitude },
          { latitude: destinationLatitude, longitude: destinationLongitude },
        ],
        {
          edgePadding: {
            top: 100,
            right: 100,
            bottom: 200,
            left: 100,
          },
          animated: true,
        }
      );
    }
  }

  return (
    <>
      <MapViewDirections
        origin={{
          latitude: originLatitude,
          longitude: originLongitude,
        }}
        destination={{
          latitude: destinationLatitude,
          longitude: destinationLongitude,
        }}
        apikey={googleApiKey || ''} // Required
        strokeWidth={4}
        onReady={(result) => {
            adjustMapViewForRoute(
            originLatitude,
            originLongitude,
            destinationLatitude,
            destinationLongitude
            );

            console.log(`Distance: ${ConversionUtil.kilometersToMiles(result.distance)} miles`);
            console.log(`Duration: ${ConversionUtil.minutesToReadableTime( result.duration)} `);
            setTravelTimeAndDistance(result.duration, result.distance);
            // console.log(`Result ${JSON.stringify(result)}`);
            

          }}
        onError={(errorMessage) => {
          console.error("Error in MapViewDirections:", errorMessage);
          Alert.alert("Error calculating route:", errorMessage);
        }}
      />
    </>
  );
}

export default DirectionsComponent;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import GooglePlacesAutoCompleteComponent from "../components/map/GooglePlacesAutoCompleteComponent";
import ColorConstants from "../constants/ColorConstants";
import { useTheme } from "../contexts/ThemeContextProps";
import TravelDetailComponent from "../components/map/TravelDetailComponent";
import DirectionsComponent from "../components/map/DirectionsComponent";
import TravelStatistics from "../components/map/TravelStatistics";
import ConfirmationComponent from "../components/map/ConfirmationComponent";
import Geocoder from "react-native-geocoding";
import { useAuth } from "../contexts/AuthContext";
import APIUtil from "../utils/APIUtil";
import IrsMilageRate from "../models/IrsMilageRate";

function MapScreen(): JSX.Element {
  const [irsTravelCentPerMile, setIrsTravelCentPerMile] = useState<number>(67);
  const { jwtToken, googleApiKey } = useAuth();

  const { theme } = useTheme();

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
    address: string;
  }>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    address: "",
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const [isTravelDetailVisible, setIsTravelDetailVisible] =
    useState<boolean>(false);

  const [travelTimeAndDistance, setTravelTimeAndDistance] = useState<{
    timeMinutes: number;
    distance: number;
  } | null>(null);
  function setTravelTimeAndDistanceHelper(
    timeMinutes: number,
    distance: number
  ): void {
    setTravelTimeAndDistance({ timeMinutes, distance });
  }
  useEffect(() => {
    if (jwtToken) {
      const currentYear = new Date().getFullYear();
      APIUtil.getIrsMilageRateByYear(jwtToken, currentYear).then(
        (res: IrsMilageRate) => {
          setIrsTravelCentPerMile(res.CentsPerMile);
        }
      );
    }
  }, []);

  function setDestinationLocation(
    latitude: number | undefined,
    longitude: number | undefined,
    destinationTitle: string
  ): void {
    if (!latitude || !longitude) {
      Alert.alert(
        `[+] Invalid location latitude: ${latitude}, longitude: ${longitude}`
      );
      return;
    }
    setSelectedLocation({
      latitude: latitude,
      longitude: longitude,
      address: destinationTitle,
    });
    console.log("Selected Location: ", selectedLocation);
  }

  const [isConfirmationVisible, setIsConfirmationVisible] =
    useState<boolean>(false);

  // ref
  const bottomSheetRef: React.RefObject<BottomSheet> =
    useRef<BottomSheet>(null);
  const mapRef: React.RefObject<MapView> = useRef<MapView>(null);

  // callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log("handleSheetChanges", index);
      if (index === 0) {
        bottomSheetRef.current?.snapToIndex(1);
      }
    },
    [bottomSheetRef]
  );

  function handleBottomSheetGoogleAPIPlaces(index: number) {
    bottomSheetRef.current?.snapToIndex(index);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        status = (await Location.requestForegroundPermissionsAsync()).status;
        if (status !== "granted") {
          Alert.alert(
            "Permission to access location was denied. Please enable Location Permission in the settings"
          );
          return;
        }
      }
      Geocoder.init(googleApiKey);

      let location = await Location.getCurrentPositionAsync({});

      // Reverse Geocode to get address
      Geocoder.from(location.coords.latitude, location.coords.longitude)
        .then((response) => {
          const address = response.results[0].formatted_address;
          console.log("Current Location Address: ", address);
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            address: address,
          });
        })
        .catch((error) => console.warn("Geocoding Error:", error));
    })();
  }, [setRegion, googleApiKey]);

  async function moveToLocation(
    latitude: number | undefined,
    longitude: number | undefined
  ): Promise<void> {
    if (!latitude || !longitude) {
      Alert.alert(
        `[+] Invalid location latitude: ${latitude}, longitude: ${longitude}`
      );
      return;
    }
    // add a little bit of offset to the latitude to center the marker
    latitude = latitude - 0.015;
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0192,
      },
      700
    );
  }

  let renderAction;

  if (selectedLocation && !isTravelDetailVisible && !isConfirmationVisible) {
    renderAction = (
      <TravelDetailComponent
        address={selectedLocation.address}
        longitude={selectedLocation.longitude}
        latitude={selectedLocation.latitude}
        onCancel={() => {
          setSelectedLocation(null);
          setIsTravelDetailVisible(false);
        }}
        startTravel={() => {
          setIsTravelDetailVisible(true);
          handleBottomSheetGoogleAPIPlaces(1);
        }}
      ></TravelDetailComponent>
    );
  } else if (
    isTravelDetailVisible &&
    travelTimeAndDistance &&
    !isConfirmationVisible
  ) {
    renderAction = (
      <TravelStatistics
        kilometers={travelTimeAndDistance!.distance}
        minutes={travelTimeAndDistance!.timeMinutes}
        irsCentPerMile={irsTravelCentPerMile}
        onCancel={() => {
          setIsTravelDetailVisible(false);
          setTravelTimeAndDistance(null);
        }}
        onTravel={() => {
          setIsConfirmationVisible(true);
          handleBottomSheetGoogleAPIPlaces(4);
        }}
      ></TravelStatistics>
    );
  } else if (
    isTravelDetailVisible &&
    travelTimeAndDistance &&
    isConfirmationVisible &&
    selectedLocation
  ) {
    renderAction = (
      <ConfirmationComponent
        irsCentPerMile={irsTravelCentPerMile}
        kilometers={travelTimeAndDistance!.distance}
        minutes={travelTimeAndDistance!.timeMinutes}
        originalAddress={region.address}
        destinationAddress={selectedLocation.address}
        onCancel={function (): void {
          setIsConfirmationVisible(false);
        }}
      ></ConfirmationComponent>
    );
  } else {
    renderAction = (
      <GooglePlacesAutoCompleteComponent
        handleBottomSheet={handleBottomSheetGoogleAPIPlaces}
        moveToLocation={moveToLocation}
        setDestinationLocation={setDestinationLocation}
      ></GooglePlacesAutoCompleteComponent>
    );
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followsUserLocation={false}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={selectedLocation.address}
            />
          )}

          {isTravelDetailVisible && (
            <DirectionsComponent
              originLatitude={region.latitude}
              originLongitude={region.longitude}
              destinationLatitude={selectedLocation!.latitude}
              destinationLongitude={selectedLocation!.longitude}
              mapRef={mapRef}
              setTravelTimeAndDistance={setTravelTimeAndDistanceHelper}
            ></DirectionsComponent>
          )}
        </MapView>
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={["13%", "25%", "50%", "100%"]}
          index={1} // Start at 25%
          enablePanDownToClose={false} // Disable closing the sheet
          animateOnMount={true}
          backgroundStyle={{
            backgroundColor:
              theme === "light" ? ColorConstants.WHITE : ColorConstants.BLACK,
          }} // Style the background
          handleIndicatorStyle={{
            backgroundColor:
              theme === "light" ? ColorConstants.BLACK : ColorConstants.WHITE,
          }} // Style the drag indicator
        >
          <BottomSheetView>{renderAction}</BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;

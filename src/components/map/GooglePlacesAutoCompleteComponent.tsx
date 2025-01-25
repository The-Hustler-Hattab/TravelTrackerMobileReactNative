import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import ApiConstants from "../../constants/AppApiConstants";
import ColorConstants from "../../constants/ColorConstants";
import { useTheme } from "../../contexts/ThemeContextProps";
import { useAuth } from "../../contexts/AuthContext";

interface GooglePlacesAutoCompleteComponentProps {
  handleBottomSheet: (index: number) => void;
  moveToLocation: (latitude: number| undefined, longitude: number| undefined) => Promise<void>;
  setDestinationLocation: (latitude: number | undefined, longitude: number | undefined, address: string,
  ) => void;
}

function GooglePlacesAutoCompleteComponent({
  handleBottomSheet,
  moveToLocation,
  setDestinationLocation
}: GooglePlacesAutoCompleteComponentProps): JSX.Element {
  const { theme } = useTheme();
  const { googleApiKey } = useAuth();
  
  let themeColor = theme === "light" ? ColorConstants.WHITE : ColorConstants.GRAY;

  


  return (
    <GooglePlacesAutocomplete
      placeholder="Search for a destination"
      onPress={(data, details = null) => {
        console.log("data: ", data);
        console.log("details: ", details);
        console.log("details.geometry.location: ", details?.geometry?.location);
        moveToLocation( details?.geometry?.location?.lat, details?.geometry?.location?.lng);
        setDestinationLocation( details?.geometry?.location?.lat, details?.geometry?.location?.lng, data.description);
        handleBottomSheet(3);

        // Extract the location from the selected result
      }}
      query={{
        key: googleApiKey || '', // Replace with your API key
        language: "en",
      }}
      preProcess={(data) => {
        // handleBottomSheet(4);
        return data;
      }}
      textInputProps={{
        onFocus: () => {
          handleBottomSheet(4);
        }
      }
      }
      
      fetchDetails={true}
      styles={{
        textInput: [styles.searchInput, {  backgroundColor: themeColor    }],
        listView: [styles.listView, { backgroundColor: themeColor }],
        row: [styles.row, { backgroundColor: themeColor }],
        poweredContainer: {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeColor, // Match the background color of your app
        },
      }}
      onFail={(error) => console.error(error)}
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 50,
    borderColor: ColorConstants.GRAY,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginLeft: 30,
    marginRight: 30,
    zIndex: 2, // Ensures dropdown is on top
  },
  listView: {
    zIndex: 1, // Ensures dropdown is on top
    position: "absolute", // Prevents clipping
    marginTop: 55,
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default GooglePlacesAutoCompleteComponent;



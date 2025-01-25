import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContextProps";
import ColorConstants from "../constants/ColorConstants";
import ListItemComponent from "../components/statistics/ListItemComponent";
import TravelTrackerModel from "../models/TravelTrackerModel";
import { useAuth } from "../contexts/AuthContext";
import APIUtil from "../utils/APIUtil";

function StatisticsScreen({ route, navigation }: { route: any , navigation: any }): JSX.Element {
  const { theme } = useTheme();
  const { jwtToken } = useAuth();
  const [records, setRecords] = useState<TravelTrackerModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTravelTrackerRecords = async () => {
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    try {
      setIsLoading(true); // Show loading state
      const fetchedRecords = await APIUtil.getAllTravelTrackerRecords(jwtToken);
      setRecords(fetchedRecords); // Update state with fetched data
    } catch (error) {
      console.error("Failed to fetch travel tracker records:", error);
      Alert.alert("Error", "Failed to fetch travel tracker records");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Fetch data on initial render
  useEffect(() => {

      if (route?.params?.refresh==true || route?.params?.refresh==undefined){
        console.log(route?.params?.refresh);
        fetchTravelTrackerRecords();

        navigation.setParams({ refresh: false });
      }

    
  }, [jwtToken, route?.params?.refresh]);
  


  return (
    <View style={{ flex: 1, backgroundColor: theme === "light" ? ColorConstants.WHITE : ColorConstants.BLACK }}>
      

      {/* FlatList to display records */}
      {records && (
        <FlatList
          data={records}
          renderItem={({ item }) => (
            <ListItemComponent travelRecord={item} allRecords={records} setAllRecords={setRecords} />
          )}
          keyExtractor={(item) => item.ID.toString()}

          contentContainerStyle={styles.container}
        />
      )}

      {/* Show a loading indicator if fetching */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Ionicons
            name="sync"
            size={48}
            color={ColorConstants.GRAY}
            style={{ transform: [{ rotate: "360deg" }] }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    margin: 10,
    paddingBottom: 50,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default StatisticsScreen;

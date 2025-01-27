import React, { useEffect } from "react";
import { StyleSheet, PermissionsAndroid, Platform, Alert } from "react-native";
import MapScreen from "./src/screen/MapScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import RouteConstants from "./src/constants/RouteConstants";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import StatisticsScreen from "./src/screen/StatisticsScreen";
import SettingScreen from "./src/screen/SettingScreen";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContextProps";
import { StatusBar } from "react-native";
import ColorConstants from "./src/constants/ColorConstants";
import * as Location from "expo-location";
import LoginScreen from "./src/screen/LoginScreen";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import AboutScreen from "./src/screen/AboutScreen";
// Drawer Navigator
const Drawer = createDrawerNavigator();

function AppNavigator() {
  const { jwtToken } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const checkLocationPermission = async () => {
      if (Platform.OS === "android") {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (hasPermission) {
          console.log("Location permission already granted");
          return;
        }
      } else if (Platform.OS === "ios") {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          console.log("Location permission already granted");
          return;
        }
      }
      requestLocationPermission();
    };

    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
          } else {
            Alert.alert(
              "Permission to access location was denied. Please enable Location Permission in the settings"
            );
          }
        } catch (err) {
          console.warn(err);
        }
      } else if (Platform.OS === "ios") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission to access location was denied. Please enable Location Permission in the settings"
          );
        }
      }
    };

    checkLocationPermission();
  }, []);

  return (
    <>
      {jwtToken ? (
        <>
          <StatusBar
            barStyle={theme === "dark" ? "light-content" : "dark-content"}
            backgroundColor={
              theme === "dark" ? ColorConstants.BLACK : ColorConstants.WHITE
            } // Background color of the status bar
            translucent={false} // Set translucent to false for a solid color background
          />
          <NavigationContainer
            theme={theme === "light" ? DefaultTheme : DarkTheme}
          >
            <Drawer.Navigator
              initialRouteName={RouteConstants.MAP}
              screenOptions={{
                headerShown: true, // Enable header
              }}
            >
              <Drawer.Screen
                name={RouteConstants.MAP}
                component={MapScreen}
                options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons
                      name={focused ? "map" : "map-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Drawer.Screen
                name={RouteConstants.STATISTICS}
                component={StatisticsScreen}
                options={({ navigation }) => ({
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons
                      name={focused ? "stats-chart" : "stats-chart-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                  headerRight: () => (
                    <Ionicons
                      name="refresh"
                      size={24}
                      color={ theme === "dark" ? ColorConstants.WHITE : ColorConstants.BLACK} // Change to your theme's color dynamically if needed
                      style={{ marginRight: 16 }}
                      onPress={() => {
                        // Trigger a refresh via a callback or directly call a function
                        navigation.navigate(RouteConstants.STATISTICS, {
                          refresh: true, // Pass any needed parameter to trigger the refresh
                        });
                      }}
                    />
                  ),
                })}
              />
              <Drawer.Screen
                name={RouteConstants.SETTINGS}
                component={SettingScreen}
                options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons
                      name={focused ? "settings" : "settings-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Drawer.Screen
                name={RouteConstants.ABOUT}
                component={AboutScreen}
                options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons
                      name={focused ? "information-circle" : "information-circle-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />


            </Drawer.Navigator>
          </NavigationContainer>
        </>
      ) : (
        <LoginScreen></LoginScreen>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* <LoginScreen></LoginScreen> */}

      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}

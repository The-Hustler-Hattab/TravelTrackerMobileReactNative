import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
} from "react-native";
import ApiConstants from "../constants/AppApiConstants";
import { useTheme } from "../contexts/ThemeContextProps";
import TextComponent from "../components/general/TextComponent";
import ColorConstants from "../constants/ColorConstants";

function AboutScreen(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "light" ? ColorConstants.WHITE : ColorConstants.BLACK,
        },
      ]}
    >
      <Image
        source={require("../assets/HattabLLC.png")} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />
      <TextComponent style={styles.title}>Travel Tracker</TextComponent>
      <TextComponent style={styles.subtitle}>By Hattab LLC</TextComponent>
      <TextComponent style={styles.description}>
        Welcome to Travel Tracker, your trusted companion for managing business
        travel. Designed to help you track your journeys, optimize travel
        routes, and save on taxes, Travel Tracker simplifies the way you manage
        travel records.
      </TextComponent>

      <TouchableOpacity
        onPress={() =>
          openURL(ApiConstants.TRAVEL_TRACKER_API_URL + "swagger/index.html")
        }
      >
        <TextComponent style={styles.link}>
          Swagger API Documentation
        </TextComponent>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          openURL("https://www.linkedin.com/in/mohammed-hattab-295076216/")
        }
      >
        <TextComponent style={styles.link}>LinkedIn</TextComponent>
      </TouchableOpacity>

      <TextComponent style={styles.footer}>
        Copyright © {new Date().getFullYear()} Hattab LLC. All rights reserved.
      </TextComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  link: {
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    color: "#999",
    marginTop: 20,
  },
  logo: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    marginBottom: 20,
  },
});

export default AboutScreen;

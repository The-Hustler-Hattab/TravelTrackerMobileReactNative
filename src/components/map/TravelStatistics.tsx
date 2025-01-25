import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import TextComponent from "../general/TextComponent";
import ColorConstants from "../../constants/ColorConstants";
import StringUtil from "../../utils/StringUtil";
import { Ionicons } from "@expo/vector-icons";
import ConversionUtil from "../../utils/ConversionUtil";
import { useTheme } from "../../contexts/ThemeContextProps";

function TravelStatistics({irsCentPerMile, kilometers, minutes, onCancel, onTravel }: 
  {irsCentPerMile: number, kilometers: number, minutes: number, onTravel: ()=> void, onCancel: ()=> void }): JSX.Element {
  const { theme } = useTheme();

  let miles = ConversionUtil.kilometersToMiles(kilometers);
  
  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel()}
          
        >
          <Ionicons name="close-circle-outline" size={24} 
                      color={
                        theme === "light" ? ColorConstants.BLACK : ColorConstants.WHITE
                      }
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onTravel()
      }>
        <Ionicons name="arrow-forward" size={24} color="white" style={styles.icon} />
      </TouchableOpacity>

      <TextComponent style={styles.TextComponentStyle}>
        Travel Details:
      </TextComponent>

      <Card style={styles.cardStyle}>
        <Card.Content>
          <Text style={styles.titleTextCardStyle}>IRS Travel Formula for {new Date().getFullYear()}: </Text>

          <Text style={styles.textCardStyle}>{irsCentPerMile} cents per mile</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>Travel Distance: </Text>

          <Text style={styles.textCardStyle}>{miles} miles</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>Estimated Travel Time: </Text>

          <Text style={styles.textCardStyle}>{ConversionUtil.minutesToReadableTime(minutes)}</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>
            Calculated Tax Deduction:
          </Text>

          <Text style={styles.textCardStyle}>${ConversionUtil.calculateTaxDeduction(miles, irsCentPerMile)}</Text>
        </Card.Content>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  TextComponentStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  cardStyle: {
    backgroundColor: ColorConstants.GRAY,
    marginRight: 20,
    marginLeft: 20,
  },
  textCardStyle: {
    fontSize: 20,
    margin: 5,
    fontWeight: "bold",
  },
  titleTextCardStyle: {
    fontSize: 15,
  },
  cardMargin: {
    marginTop: 15,
  },
  cancelButton: {
    marginLeft: 10, // Space between text and icon
    padding: 5,
    position: "absolute",
    right: 10, // Adjust as needed
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorConstants.GREEN, // Blue background color
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingRight: 10,
    margin: 10,
    marginRight: 200,
    marginLeft: 20,
    marginTop: 15,
  },
});

export default TravelStatistics;

import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Text } from "react-native-paper";
import ColorConstants from "../../constants/ColorConstants";
import { useTheme } from "../../contexts/ThemeContextProps";
import TextComponent from "../general/TextComponent";
import StringUtil from "../../utils/StringUtil";

interface TravelDetailProps {
  address: string;
  latitude: number;
  longitude: number;
  onCancel: () => void;
  startTravel: () => void;
}

function TravelDetailComponent({
  address,
  latitude,
  longitude,
  onCancel,
  startTravel
}: TravelDetailProps): JSX.Element {
  const { theme } = useTheme();
  return (
    <>
      <View style={styles.row}>
        <TextComponent style={styles.TextStyle}>
          {StringUtil.getWordsBeforeDelimiter(address, ",")}
        </TextComponent>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel()}
        >
          <Ionicons
            name="close-circle-outline"
            size={24}
            color={
              theme === "light" ? ColorConstants.BLACK : ColorConstants.WHITE
            }
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => startTravel()}
      >
        <Ionicons name="car" size={24} color="white" style={styles.icon} />
      </TouchableOpacity>

      <TextComponent style={styles.TextComponentStyle}>Details</TextComponent>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Text>Address: </Text>

          <Text style={styles.textCardStyle}>{address}</Text>
        </Card.Content>

        <Card.Content>

          <Text>Coordinates: </Text>

          <Text style={styles.textCardStyle}>
            {`latitude ${latitude}, longitude ${longitude}`}
          </Text>
        </Card.Content>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    marginLeft: 10, // Space between text and icon
    padding: 5,
    position: "absolute",
    right: 10, // Adjust as needed
  },
  row: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorConstants.BLUE_NAVY, // Blue background color
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingRight: 10,
    margin: 10,
    marginRight: 200,
    marginLeft: 20,
    marginTop: 15,
  },
  cardStyle: {
    backgroundColor: ColorConstants.GRAY,
    marginRight: 20,
    marginLeft: 20,
  },
  TextComponentStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  textCardStyle: {
    fontSize: 15,
    margin: 5,
    fontWeight: "bold",
  },
  TextStyle: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 20,
  },
});

export default TravelDetailComponent;


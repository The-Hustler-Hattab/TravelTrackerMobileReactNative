import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TravelTrackerModel from "../../models/TravelTrackerModel";
import { useAuth } from "../../contexts/AuthContext";
import APIUtil from "../../utils/APIUtil";

interface ListItemProps {
  travelRecord: TravelTrackerModel;
  allRecords: TravelTrackerModel[];
  setAllRecords: (allRecords: TravelTrackerModel[]) => void;
}

function ListItemComponent({
  travelRecord,
  allRecords,
  setAllRecords,
}: ListItemProps): JSX.Element {
  const { jwtToken } = useAuth();

  function deleteTravelRecord() {
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    try {
      // Call API to delete record
      console.log("Delete button pressed with id: " + travelRecord.ID);
      APIUtil.deleteTravelTrackerRecordById(jwtToken, travelRecord.ID).then(
        (res) => {
          if (res.status === 200) {
            console.log("Successfully deleted travel tracker record");
            Alert.alert(
              "Success",
              "Successfully deleted travel tracker record"
            );
            allRecords = allRecords.filter(
              (record) => record.ID !== travelRecord.ID
            );
            console.log(
              "All records after delete: " + JSON.stringify(allRecords)
            );

            setAllRecords(allRecords);
          } else {
            console.error(
              "Failed to delete travel tracker record" + res.text()
            );
            Alert.alert(
              "Error",
              "Failed to delete travel tracker record api status: " + res.status
            );
          }
        }
      );
    } catch (error) {
      console.error("Failed to delete travel tracker record:", error);
      Alert.alert("Error", "Failed to delete travel tracker record");
    }
  }



  let comment;
  if (travelRecord.Comment) {
    comment = travelRecord.Comment;
  } else {
    comment = "N/A";
  }

  return (
    <>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTravelRecord()}
            >
              <Ionicons name="close-circle-outline" size={24} />
            </TouchableOpacity>
          </View>

          <Title>Travel Date:</Title>
          <Paragraph>
            {travelRecord.CreatedAt
              ? new Date(travelRecord.CreatedAt)
                  .toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                  .replace(",", "")
              : "N/A"}
          </Paragraph>

          <Title>Travel Time:</Title>
          <Paragraph>{travelRecord.TravelTime}</Paragraph>

          <Title>Travel From:</Title>
          <Paragraph>{travelRecord.TravelFrom}</Paragraph>

          <Title>Travel To:</Title>
          <Paragraph>{travelRecord.TravelTo}</Paragraph>

          <Title>Travel Distance:</Title>
          <Paragraph>{travelRecord.TravelDistance} miles</Paragraph>

          <Title>Estimated Tax Deductions:</Title>
          <Paragraph>${travelRecord.EstimatedTaxDeductions}</Paragraph>


          <Title>Comments:</Title>
          <Paragraph>{comment}</Paragraph>

        </Card.Content>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center", // Center the button horizontally
  },
  deleteButton: {
    marginLeft: 10, // Space between text and icon
    padding: 5,
  },
  cardStyle: {
    paddingRight: 20,
    marginTop: 10,
  },
});

export default ListItemComponent;

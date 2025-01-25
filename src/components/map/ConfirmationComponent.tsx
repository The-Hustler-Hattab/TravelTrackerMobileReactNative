

import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Card } from "react-native-paper";
import ColorConstants from "../../constants/ColorConstants";
import ConversionUtil from "../../utils/ConversionUtil";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContextProps";
import TextComponent from "../general/TextComponent";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../contexts/AuthContext";
import APIUtil from "../../utils/APIUtil";
import TravelTrackerModel from "../../models/TravelTrackerModel";



function ConfirmationComponent({irsCentPerMile, kilometers, minutes, originalAddress,destinationAddress, onCancel }: 
  {irsCentPerMile: number, kilometers: number, minutes: number, originalAddress: string, destinationAddress: string , onCancel: ()=> void }) {
    const { theme } = useTheme();
    const { jwtToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    let miles = ConversionUtil.kilometersToMiles(kilometers);
    let taxDeduction = ConversionUtil.calculateTaxDeduction(miles, irsCentPerMile);
    let travelTime = ConversionUtil.minutesToReadableTime(minutes);
    const [text, setText] = useState(''); // Initialize state to store input

    function saveTravel(){
      console.log("Save Travel")
      const travelRecord: TravelTrackerModel ={
        EstimatedTaxDeductions: taxDeduction,
        TravelDistance: miles,
        TravelFrom: originalAddress,
        TravelTo:  destinationAddress,
        TravelTime: travelTime,
        Comment: text,
        ID: 0, // ID is not used when creating a new record
        CreatedAt: null, // CreatedAt is not used when creating a new record
        CreatedBy: "" // CreatedBy is not used when creating a new record
      }
      if(jwtToken){
        setIsLoading(true); // Show loading state

        try {
          // Call API to create record
          console.log("Save button pressed with record: " + JSON.stringify(travelRecord));
          APIUtil.createTravelTrackerRecord(jwtToken,travelRecord).then((res) => {
            console.log(res.status);
            
            if (res.status === 201) {
              console.log("Successfully saved travel record");
              Alert.alert(
                "Success",
                "Successfully saved travel record"
              );
              
            }else{
              console.log("Failed to save travel record");
              Alert.alert(
                "Error",
                "Failed to save travel record "+ res.json()
              );
            }
          })
        } catch (error) {
          console.error("Failed to save travel record:", error);
          Alert.alert("Error", "Failed to save travel record");

        }finally{
          setIsLoading(false); // Hide loading state
        }
        
      }
    }

    return (
        <>
         <View style={styles.row}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel()
          }
          
        >
          <Ionicons name="close-circle-outline" size={24} 
                      color={
                        theme === "light" ? ColorConstants.BLACK : ColorConstants.WHITE
                      }
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => saveTravel()}>
        <Ionicons name="save" size={24} color="white" style={styles.icon} />
      </TouchableOpacity>

      <TextComponent style={styles.TextComponentStyle}>
        Confirmation Details:
      </TextComponent>

      <Card style={styles.cardStyle}>


      <Card.Content >
          <Text style={styles.titleTextCardStyle}>
            Comments
          </Text>
          <TextInput style={styles.textCardStyle} 
          placeholder="(Optional) 500 characters max"
                  onChangeText={setText} // Update state when text changes
                  value={text} // Controlled component
                  maxLength={500} // Limit input to 500 characters

          ></TextInput>
        </Card.Content>


        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>Travel Distance: </Text>

          <Text style={styles.textCardStyle}>{miles} miles</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>Estimated Travel Time: </Text>

          <Text style={styles.textCardStyle}>{travelTime}</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>Calculated Tax Deduction: </Text>

          <Text style={styles.textCardStyle}>${taxDeduction}</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>
            Original Location
          </Text>

          <Text style={styles.textCardStyle}>{originalAddress}</Text>
        </Card.Content>

        <Card.Content style={styles.cardMargin}>
          <Text style={styles.titleTextCardStyle}>
            Destination Location
          </Text>

          <Text style={styles.textCardStyle}>{destinationAddress}</Text>
        </Card.Content>


      </Card>
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

        </>
    )
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

export default ConfirmationComponent;
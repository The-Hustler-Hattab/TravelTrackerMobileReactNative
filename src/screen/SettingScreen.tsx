import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { Card, Text, Switch } from "react-native-paper";
import ColorConstants from "../constants/ColorConstants";
import { useTheme } from "../contexts/ThemeContextProps";
import { useAuth } from "../contexts/AuthContext";

function SettingScreen(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  const { setToken, setRefreshToken} = useAuth();

  function handleLogout() {
    console.log("Logout");
    setToken(null);
    setRefreshToken(null);
  }
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
      <Card style={styles.cardStyle}>
        <Card.Content style={styles.switchContainer}>
          <Text style={[styles.text]}>Dark Theme</Text>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            color={ColorConstants.BLACK}
          />
        </Card.Content>

        <Card.Content style={styles.logoutContainer}>
          <View style={styles.logoutButton}>
          <Button
            title="Logout"
            onPress={handleLogout}
            
          />
          </View>

        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,

  },
  cardStyle: {
    backgroundColor: ColorConstants.GRAY,
  },
  logoutButton: {
    width: "80%",
  },
});

export default SettingScreen;

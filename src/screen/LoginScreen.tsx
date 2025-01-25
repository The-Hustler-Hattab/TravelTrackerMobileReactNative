import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import * as AuthSession from "expo-auth-session";
import AuthConstants from "../constants/AuthConstants";
import AuthUtils from "../utils/AuthUtils";
import { useAuth } from "../contexts/AuthContext";
import TextComponent from "../components/general/TextComponent";
import { useTheme } from "../contexts/ThemeContextProps";
import ColorConstants from "../constants/ColorConstants";
import APIUtil from "../utils/APIUtil";

function LoginScreen() {
  const { setRefreshToken, setToken, refreshToken, jwtToken, setGoogleApiKey } = useAuth();
  const discovery = AuthSession.useAutoDiscovery(AuthConstants.ISSUER);
  const clientId = AuthConstants.CLIENT_ID;
  const { theme } = useTheme();

  const redirectUri = AuthSession.makeRedirectUri({path: 'redirect'});
  console.log("redirectUri: " + redirectUri);
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId,
      scopes: AuthConstants.SCOPES,
      redirectUri: redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response && response?.type === "success") {
      AuthUtils.generateJwt(discovery, response, request, redirectUri)
        .then((res) => {
          console.log("response: " + JSON.stringify(res));
          setToken(res.accessToken);
          if (res.refreshToken) {
            setRefreshToken(res.refreshToken);
            console.log("set refresh token: " + res.refreshToken);
            console.log("refresh token: " + refreshToken);

          }
          APIUtil.getApiKey(res.accessToken).then((res) => {
            setGoogleApiKey(res.apiKey);
            console.log("googleApiKey: " + res.apiKey);

          })
        })
        .catch((err) => console.error(err));
    }
  }, [response, discovery, request]);

  return (
    <View style={[styles.container, { backgroundColor: theme === "light" ? ColorConstants.WHITE : ColorConstants.BLACK }]}>
      {/* Add Larger Login Text */}
      <TextComponent style={styles.title}>Hattab LLC</TextComponent>

      {/* Add Company Logo */}
      <Image
        source={require("../assets/HattabLLC.png")} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Login Button */}
      <Button title="Login with Okta" onPress={() => promptAsync()} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,

  },
  title: {
    fontSize: 32, // Adjust size for larger text
    fontWeight: "bold",
    marginBottom: 20, // Add spacing below the title
  },
  logo: {
    width: 150, // Adjust size based on your logo dimensions
    height: 150,
    marginBottom: 20, // Add spacing below the logo
  },
});

export default LoginScreen;



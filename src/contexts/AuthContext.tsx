import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import * as AuthSession from "expo-auth-session";
import AuthConstants from "../constants/AuthConstants";
import AuthUtils from "../utils/AuthUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DiscoveryHandlerUtil from "../utils/DiscoveryHandlerUtil";

interface AuthContextProps {
  jwtToken: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;

  refreshToken: string | null;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;

  googleApiKey: string | null;
  setGoogleApiKey: React.Dispatch<React.SetStateAction<string | null>>;

}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jwtToken, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  
  // Keys for AsyncStorage
  const TOKEN_KEY = "JWT_TOKEN";
  const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";
  const GOOGLE_API_KEY = "GOOGLE_API_KEY";


  const discovery = AuthSession.useAutoDiscovery(AuthConstants.ISSUER);

  console.log("AuthProvider");
  

  // Load tokens from storage on mount
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedJwtToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        const storedGoogleApiKey = await AsyncStorage.getItem(GOOGLE_API_KEY);


        if (storedJwtToken && !AuthUtils.isTokenExpired(storedJwtToken)) setToken(storedJwtToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
        if (storedGoogleApiKey) setGoogleApiKey(storedGoogleApiKey);

      } catch (error) {
        console.error("Failed to load tokens from storage", error);
      }
    };

    loadTokens();
  }, []);

  // Save tokens to storage when they change
  useEffect(() => {
    const saveTokens = async () => {
      try {
        
        if (jwtToken) {
          console.log("Saving token");
          await AsyncStorage.setItem(TOKEN_KEY, jwtToken);
        } else {
          console.log("Removing token");
          await AsyncStorage.removeItem(TOKEN_KEY);
        }


        if (googleApiKey) {
          console.log("Saving token for google api key");
          await AsyncStorage.setItem(GOOGLE_API_KEY, googleApiKey);
        } 


        if (refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } else {
          await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      } catch (error) {
        console.error("Failed to save tokens to storage", error);
      }
    };

    saveTokens();
  }, [jwtToken, refreshToken, googleApiKey]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (refreshToken && discovery ) {
        AuthUtils.refreshToken(refreshToken, discovery, jwtToken)?.then(
          (res) => {
            if (res?.accessToken) {
              setToken(res.accessToken);
            }
          }
        );
      }
    }, 1.8e6); // 30 minutes
    return () => clearInterval(intervalId);
  }, [jwtToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ jwtToken, setToken, refreshToken, setRefreshToken, googleApiKey, setGoogleApiKey }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

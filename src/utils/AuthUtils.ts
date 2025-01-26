import * as AuthSession from "expo-auth-session";
import AuthConstants from "../constants/AuthConstants";
import { jwtDecode } from "jwt-decode";

class AuthUtils {


/**
 * Generates an authorization code from the given AuthSession result.
 *
 * @param {AuthSession.AuthSessionResult} response - The result of the AuthSession.
 * @returns {string} The authorization code if the response is successful.
 * @throws {Error} If the response is not successful.
 */
  public static generateAuthorizationCode(
    response: AuthSession.AuthSessionResult | null
  ): string | null {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log("Authorization code response: " + JSON.stringify(response.params));
      return code;
    } else {
      return null;
    }
  }

/**
 * Generates a JSON Web Token (JWT) by exchanging an authorization code.
 *
 * @param discovery - The discovery document containing the authorization server's metadata.
 * @param response - The result of the authentication session, containing the authorization code.
 * @param request - The authentication request, containing the code verifier.
 * @returns A promise that resolves to an AuthSession.TokenResponse object containing the JWT.
 * @throws An error if the discovery document is null or if there is an issue generating the JWT.
 */
  public static generateJwt(
    discovery: AuthSession.DiscoveryDocument | null,
    response: AuthSession.AuthSessionResult | null,
    request: AuthSession.AuthRequest | null,
    redirectUri: string 
  ): Promise<AuthSession.TokenResponse> | never {
    
    const authorizationCode = AuthUtils.generateAuthorizationCode(response);
    
    if (discovery) {

      const tokenResponse = AuthSession.exchangeCodeAsync(
        {
          code: authorizationCode || "",
          redirectUri: redirectUri,
          clientId: AuthConstants.CLIENT_ID,
          extraParams: {
            code_verifier: request?.codeVerifier || "",
          },
        },
        discovery
      );
      return tokenResponse
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.error("generateJwt: "+ err);
            return Promise.reject(err);
        });
    } else {
      console.error("Discovery document is null");
      return Promise.reject(new Error("Discovery document is null"));

    }
  }

/**
 * Refreshes the authentication token using the provided refresh token and discovery document.
 *
 * @param {string | undefined} refreshToken - The refresh token used to obtain a new access token.
 * @param {AuthSession.DiscoveryDocument | null} discovery - The discovery document containing the authorization server's metadata.
 * @returns {Promise<AuthSession.TokenResponse | undefined>} - A promise that resolves to the new token response or undefined if an error occurs.
 *
 * @throws {Error} - Throws an error if the token refresh process fails.
 */
  public static async refreshToken(refreshToken: string | undefined, discovery: AuthSession.DiscoveryDocument | null, 
    jwtToken: string| null): Promise<AuthSession.TokenResponse | undefined> {
    

      if (!jwtToken|| jwtToken === null) {
        console.log("JWT token is null: "+ jwtToken);
        
        return undefined;  
      }

      if (!AuthUtils.isTokenExpired(jwtToken)) {
        console.log("JWT token is not expired");
        return undefined;
      }
    
    console.log("refreshing token");
    console.log("refreshToken: " + refreshToken);
  
    if (discovery && refreshToken) {
      try {
        const response = await AuthSession.refreshAsync(
          {
            refreshToken: refreshToken,
            clientId: AuthConstants.CLIENT_ID,
          },
          discovery
        );
        return response;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return undefined;
      }
    } else {
      console.error("Discovery document or refresh token is null");
      return undefined;
    }
  }

 

  public static isTokenExpired(token: string): boolean {

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      
      if ( !decoded.exp ) {
        console.error('Token has no expiration date:', decoded);
        return true;      
      }else{
        console.log('Token expiration:', decoded.exp); 
        console.log('Current time:', currentTime);
        
        if (currentTime >= decoded.exp) {

          console.log('Token has expired:', currentTime >= decoded.exp);
          return true;

        }else{
          console.log('Token has not expired:', currentTime >= decoded.exp);
          return false;
        }
      }

    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume expired if decoding fails
    }
  };


}

export default AuthUtils;

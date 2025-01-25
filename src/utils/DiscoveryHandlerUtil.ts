



import * as AuthSession from 'expo-auth-session';
import React from "react";
import AuthConstants from '../constants/AuthConstants';

class DiscoveryHandlerUtil {

    private static discovery : AuthSession.DiscoveryDocument | null = null;

    private static setDiscovery(discovery: AuthSession.DiscoveryDocument) {
        DiscoveryHandlerUtil.discovery = discovery;
    }

    public static getDiscovery(): AuthSession.DiscoveryDocument | null {
        if (!DiscoveryHandlerUtil.discovery) {
            console.log("discovery is null"+ DiscoveryHandlerUtil.discovery);
            
           const discovery = AuthSession.useAutoDiscovery(AuthConstants.ISSUER);
           console.log("Discovery: " + JSON.stringify(discovery));
           
           if (discovery) {
               this.setDiscovery(discovery);
           }
              return DiscoveryHandlerUtil.discovery;
        }else{
            console.log("discovery is not null"+ DiscoveryHandlerUtil.discovery);
            return DiscoveryHandlerUtil.discovery;

        }
    }

}

export default DiscoveryHandlerUtil;
//import * as process from "node:process";

export default {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001', // Backend URL pro tvou aplikaci
  statusBackendUrl: import.meta.env.VITE_STATUS_BACKEND_URL || 'http://localhost:5003', // Status backend URL
  keycloak: {
    baseUrl: import.meta.env.VITE_KEYCLOAK_BASE_URL || 'http://localhost:8091', // Keycloak base URL
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'GARDENING-APP', // Tvoje vlastní realm hodnota
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'gardening-frontend', // Client ID pro frontend
    redirectUri: location.origin + '/login-callback', // URI pro přesměrování po přihlášení
  }
}

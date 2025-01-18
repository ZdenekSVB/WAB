import Keycloak from "keycloak-js";

// Inicializace Keycloak
const keycloak = new Keycloak({
    url: "http://localhost:8080/auth",  // URL Keycloak serveru
    realm: "garden-realm",             // Název realm
    clientId: "garden-frontend",       // Client ID v Keycloak
});

// Funkce pro inicializaci Keycloak
export const initializeKeycloak = () => {
    return new Promise((resolve, reject) => {
        keycloak.init({ onLoad: "login-required" }).then(authenticated => {
            if (authenticated) {
                resolve(true);
            } else {
                reject("Authentication failed");
            }
        }).catch((err) => reject(err));
    });
};

export default keycloak;

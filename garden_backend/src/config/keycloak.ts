import Keycloak from 'keycloak-connect';
import session from 'express-session';

// Konfigurace Keycloak
const keycloakConfig = {
    realm: 'garden-realm',
    'auth-server-url': 'http://localhost:8080/auth',  // Ujistěte se, že URL odpovídá vašemu Keycloak serveru
    'ssl-required': 'external',
    resource: 'garden-backend', // Název vašeho klienta v Keycloak
    'confidential-port': 0,
    clientId: 'garden-backend', // Stejný clientId jako v Keycloak konfiguraci
    clientSecret: 'your-client-secret', // Client secret získaný z Keycloak
};

// Iniciace Keycloak
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

export { keycloak, memoryStore };

export const Config = {
    port: process.env.PORT || 3000,
    mongo: {
        url: process.env.MONGO_URL
    },
    printingService: {
        url: process.env.TICKET_SERVICE_URL || 'localhost:50051',
    },
    keycloak: {
        baseUrl: process.env.KEYCLOAK_BASE_URL,
        issuerUrl: process.env.KEYCLOAK_ISSUER_URL,
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
    }
}
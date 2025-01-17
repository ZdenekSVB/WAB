import { reactive, ref } from 'vue';
import axios from 'axios';
import * as client from 'openid-client';
import { jwtDecode } from 'jwt-decode';
import config from "@/config";

// State for auth
const state = reactive({
  accessToken: null,
  user: null,
  authenticated: false,
});

const error = ref<string | null>(null);
let codeChallenge: string;
let authConfig: client.Configuration;

export function useAuth() {

  const init = async () => {
    const issuerUri = `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}`;
    authConfig = await client.discovery(
      new URL(issuerUri),
      config.keycloak.clientId!,
      undefined,
      undefined,
      { execute: [client.allowInsecureRequests] } // allow running Keycloak on localhost
    );
  }

  const login = async () => {
    localStorage.setItem('code_verifier', client.randomPKCECodeVerifier());
    codeChallenge = await client.calculatePKCECodeChallenge(localStorage.getItem('code_verifier'));

    let parameters: Record<string, string> = {
      redirect_uri: config.keycloak.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    }

    localStorage.setItem('state', client.randomState());
    parameters.state = localStorage.getItem('state');

    let redirectTo: URL = client.buildAuthorizationUrl(authConfig, parameters);
    window.location.href = redirectTo.href; // Redirect to Keycloak login page
  };

  const handleCallback = async (callbackUrl: string) => {
    let tokens: client.TokenEndpointResponse = await client.authorizationCodeGrant(
      authConfig,
      new URL(callbackUrl),
      {
        pkceCodeVerifier: localStorage.getItem('code_verifier'),
        expectedState: localStorage.getItem('state'),
      },
    );

    state.authenticated = true;
    state.accessToken = tokens.access_token;
    state.user = jwtDecode(tokens.access_token);
  };

  const authorizedRequest = async (endpoint: string, options = {}) => {
    if (!state.accessToken) {
      error.value = 'Not authenticated';
      throw new Error(error.value);
    }

    const response = await axios({
      url: `${endpoint}`,
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
      },
      ...options,
    });
    return response.data;
  };

  const getUsername = () => {
    return state.user?.['preferred_username'];
  };

  return {
    state,
    error,
    init,
    login,
    handleCallback,
    authorizedRequest,
    getUsername
  };
}

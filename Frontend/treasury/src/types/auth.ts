export interface LoginCredentials {
    email: string;
    password: string;
}
  
export interface RegisterData extends LoginCredentials {
    confirmPassword?: string;
}
  
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface OAuth2LoginForm {
    username: string;  
    password: string;
    scope?: string;      
    grant_type?: string;
    client_id?: string;
    client_secret?: string;
}

export interface RefreshToken {
    refresh_token: string;
}

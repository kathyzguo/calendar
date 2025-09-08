export interface LoginData {
    email: string;
    password: string;
    stay: boolean;
}

export interface LoginErrors {
    email?: string;
    password?: string;
}

export interface LoginResponse {
    status: boolean;
    id?: number;
    message: string;
}
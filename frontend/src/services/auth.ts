import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
    message: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
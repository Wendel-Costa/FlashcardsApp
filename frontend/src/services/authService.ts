import api from './api';

interface LoginData {
   username: string;
   password: string;
}
interface RegisterData {
   username: string;
   password: string;
   // estou pensando em unir as 2 interfaces no futuro se não acabar tendo diferença
}

export const authService = {
   async login(data: LoginData): Promise<{ message: string; token: string }> {
      const response = await api.post('/users/login', data);
      return response.data;
   },
   async register(data: RegisterData): Promise<{ message: string }> {
      const response = await api.post('/users/register', data);
      return response.data;
   },
};

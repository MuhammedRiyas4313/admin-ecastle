import axios from "axios";
import { API_ENDPOINT, baseUrl } from "./url.service";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}


const END_POINT: string = API_ENDPOINT("/user/login");

export const login = (formobj: { email: string; password: string }) => {
  return axios.post<LoginResponse>(`${END_POINT}`, formobj);
};

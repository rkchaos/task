import axios from "axios";

const API_BASE_URL = "https://taskback-p0r6q8myh-rajs-projects-bbd5b6a9.vercel.app"; 


export const getUserData = (token) => {
    return axios.get(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


export const getManagerData = (token) => {
    return axios.get(`${API_BASE_URL}/with`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

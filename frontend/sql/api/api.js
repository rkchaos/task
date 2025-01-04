import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; 


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

import axios from "axios";

const API_BASE_URL = "https://task-manager-sye7.onrender.com"; 


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

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // Asegúrate de que esta es la URL correcta del backend
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;

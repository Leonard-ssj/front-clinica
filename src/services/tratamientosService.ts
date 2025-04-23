import api from "./api";
import { Tratamiento } from "../types/tratamiento";


export const crearTratamiento = async (tratamiento: Omit<Tratamiento, "idTratamiento">) => {
    try {
        const response = await api.post("/tratamientos", tratamiento);
        return response.data;
    } catch (error) {
        console.error("Error al crear tratamiento", error);
        throw error;
    }
};

export const obtenerTratamientoPorId = async (id: number): Promise<Tratamiento> => {
    try {
        const response = await api.get(`/tratamientos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo el tratamiento", error);
        throw error;
    }
};

export const actualizarTratamiento = async (id: number, tratamiento: Partial<Tratamiento>) => {
    try {
        await api.put(`/tratamientos/${id}`, tratamiento);
    } catch (error) {
        console.error("Error actualizando el tratamiento", error);
        throw error;
    }
};

export const eliminarMedicamentoDeTratamiento = async (idTratamiento: number, idMedicamento: number) => {
    try {
        await api.delete(`/tratamientos/${idTratamiento}/medicamentos/${idMedicamento}`);
    } catch (error) {
        console.error("Error eliminando medicamento del tratamiento", error);
        throw error;
    }
};

export const agregarMedicamentosATratamiento = async (idTratamiento: number, medicamentos: number[]) => {
    try {
        await api.post(`/tratamientos/${idTratamiento}/medicamentos`, medicamentos);
    } catch (error) {
        console.error("Error agregando medicamentos al tratamiento", error);
        throw error;
    }
};


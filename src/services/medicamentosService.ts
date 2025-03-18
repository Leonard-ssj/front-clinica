import api from "./api";
import { Medicamento } from "../types/medicamento";

// Obtener todos los medicamentos desde el backend
export const obtenerMedicamentos = async (): Promise<Medicamento[]> => {
    try {
        const response = await api.get("/medicamentos");
        return response.data.map((medicamento: any) => ({
            idMedicamento: medicamento.idMedicamento,
            nombre: medicamento.nombre,
            descripcion: medicamento.descripcion,
            contraindicaciones: medicamento.contraindicaciones,
            dosisRecomendada: medicamento.dosisRecomendada,
        }));
    } catch (error) {
        console.error("Error obteniendo medicamentos", error);
        return [];
    }
};

// Obtener un medicamento por ID
export const obtenerMedicamentoPorId = async (id: number): Promise<Medicamento> => {
    try {
        const response = await api.get(`/medicamentos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo medicamento", error);
        throw error;
    }
};

// Crear un nuevo medicamento
export const crearMedicamento = async (medicamento: Omit<Medicamento, "idMedicamento">) => {
    try {
        const response = await api.post("/medicamentos", medicamento);
        return response.data;
    } catch (error) {
        console.error("Error creando medicamento", error);
        throw error;
    }
};

// Actualizar un medicamento
export const actualizarMedicamento = async (id: number, medicamento: Partial<Medicamento>) => {
    try {
        await api.put(`/medicamentos/${id}`, medicamento);
    } catch (error) {
        console.error("Error actualizando medicamento", error);
        throw error;
    }
};

// Eliminar un medicamento por ID
export const eliminarMedicamento = async (id: number) => {
    try {
        await api.delete(`/medicamentos/${id}`);
    } catch (error) {
        console.error("Error eliminando medicamento", error);
        throw error;
    }
};

import api from "./api";
import { Paciente } from "../types/paciente";

// Obtener todos los pacientes
export const obtenerPacientes = async (): Promise<Paciente[]> => {
    try {
        const response = await api.get("/pacientes");
        return response.data.map((paciente: any) => ({
            idPaciente: paciente.idPaciente,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            fechaNacimiento: paciente.fechaNacimiento,
            telefono: paciente.telefono,
            correo: paciente.correo,
        }));
    } catch (error) {
        console.error("Error obteniendo pacientes", error);
        return [];
    }
};

// Obtener un paciente por ID
export const obtenerPacientePorId = async (id: number): Promise<Paciente> => {
    try {
        const response = await api.get(`/pacientes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo paciente", error);
        throw error;
    }
};

// Crear un nuevo paciente
export const crearPaciente = async (paciente: Omit<Paciente, "idPaciente">) => {
    try {
        const response = await api.post("/pacientes", paciente);
        return response.data;
    } catch (error) {
        console.error("Error creando paciente", error);
        throw error;
    }
};

// Actualizar un paciente por ID
export const actualizarPaciente = async (id: number, paciente: Partial<Paciente>) => {
    try {
        await api.put(`/pacientes/${id}`, paciente);
    } catch (error) {
        console.error("Error actualizando paciente", error);
        throw error;
    }
};

// Eliminar un paciente por ID
export const eliminarPaciente = async (id: number) => {
    try {
        await api.delete(`/pacientes/${id}`);
    } catch (error) {
        console.error("Error eliminando paciente", error);
        throw error;
    }
};

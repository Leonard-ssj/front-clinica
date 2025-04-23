import api from "./api";
import { HistoriaClinica } from "../types/historiaClinica";

// Obtener todas las historias clínicas
export const obtenerHistoriasClinicas = async (): Promise<HistoriaClinica[]> => {
    try {
        const response = await api.get("/historias");
        return response.data.map((historia: any) => ({
            idHistoria: historia.idHistoria,
            paciente: historia.paciente,
            notasMedicas: historia.notasMedicas,
            fechaUltimaActualizacion: historia.fechaUltimaActualizacion,
            tratamientos: historia.tratamientos || [] // ✅ Nos aseguramos de que `tratamientos` siempre sea un array
        }));
    } catch (error) {
        console.error("Error obteniendo historias clínicas", error);
        return [];
    }
};


// Crear una nueva historia clínica
export const crearHistoriaClinica = async (historiaClinica: Omit<HistoriaClinica, "idHistoria">) => {
    try {
        const response = await api.post("/historias", historiaClinica);
        return response.data;
    } catch (error) {
        console.error("Error creando historia clínica", error);
        throw error;
    }
};

export const obtenerHistoriaClinicaPorId = async (idHistoria: number): Promise<HistoriaClinica> => {
    const response = await api.get(`/historias/${idHistoria}`);
    return response.data;
};

import { Tratamiento } from "./tratamiento";

export interface HistoriaClinica {
    idHistoria: number;
    paciente: {
        idPaciente: number;
        nombre: string;
        apellido: string;
        fechaNacimiento: string;
        telefono: string;
        correo: string;
    };
    notasMedicas: string;
    fechaUltimaActualizacion: string;
    tratamientos: Tratamiento[]; // ✅ Agregamos esta línea
}

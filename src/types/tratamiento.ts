import { Medicamento } from "./medicamento";

export interface Tratamiento {
    idTratamiento: number;
    historiaClinica: { idHistoria: number }; // <-- Agregado aquí
    medico: {
        idUsuario: number;
        nombreUsuario: string;
        rolId: number;
    };
    fechaInicio: string;
    fechaFin: string;
    indicaciones: string;
    medicamentos: Medicamento[];
}

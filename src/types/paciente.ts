export interface Paciente {
    idPaciente: number | null; // Puede ser null en creación
    nombre: string;
    apellido: string;
    fechaNacimiento: string; // Se maneja como string en JSON
    telefono: string;
    correo: string;
}

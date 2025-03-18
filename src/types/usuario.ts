export interface Usuario {
    idUsuario: number | null; // Puede ser null en creación
    nombreUsuario: string;
    contraseña?: string; // Opcional en edición
    rolId: number | null; // Ahora puede ser null si el usuario no tiene rol asignado
    rol?: string; // Agregamos esta línea para evitar el error en UsuariosTable
}

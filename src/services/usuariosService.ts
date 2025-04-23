import api from "./api";
import { Usuario } from "../types/usuario";

// Obtener todos los usuarios desde el backend
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await api.get("/usuarios");
        return response.data.map((usuario: any) => ({
            idUsuario: usuario.idUsuario,
            nombreUsuario: usuario.nombreUsuario,
            rolId: usuario.rolId ?? null,
        }));
    } catch (error) {
        console.error("Error obteniendo usuarios", error);
        return [];
    }
};

// Eliminar usuario
export const eliminarUsuario = async (id: number) => {
    return await api.delete(`/usuarios/${id}`);
};

export const obtenerUsuarioParaEdicion = async (id: number): Promise<Usuario> => {
    try {
        const response = await api.get(`/usuarios/newpassword/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo usuario", error);
        throw error;
    }
};

export const actualizarUsuario = async (id: number, usuario: Partial<Usuario>) => {
    try {
        await api.put(`/usuarios/${id}`, usuario);
    } catch (error) {
        console.error("Error actualizando usuario", error);
        throw error;
    }
};

// ✅ Crear un nuevo usuario
export const crearUsuario = async (usuario: Omit<Usuario, "idUsuario">) => {
    try {
        const response = await api.post("/usuarios", usuario);
        return response.data;
    } catch (error) {
        console.error("Error creando usuario", error);
        throw error; // Re-lanzamos el error para manejarlo en el frontend
    }
};

// Obtener la lista de médicos (usuarios con rolId = 2)
export const obtenerMedicos = async (): Promise<Usuario[]> => {
    try {
        const response = await api.get("/usuarios/medicos");
        return response.data;
    } catch (error) {
        console.error("Error obteniendo médicos", error);
        return [];
    }
};
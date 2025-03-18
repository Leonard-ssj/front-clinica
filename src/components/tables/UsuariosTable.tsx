import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Usuario } from "../../types/usuario";

const ROLES_MAP: Record<number, string> = {
    1: "ADMINISTRADOR",
    2: "MEDICO",
    3: "ENFERMERA",
};

interface UsuariosTableProps {
    usuarios: Usuario[];
    idFilter: string;
    nameFilter: string;
    roleFilter: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    currentPage: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function UsuariosTable({ 
    usuarios, 
    idFilter, 
    nameFilter, 
    roleFilter, 
    onEdit, 
    onDelete, 
    currentPage, 
    rowsPerPage, 
    onPageChange 
}: UsuariosTableProps) {

    // Filtrar usuarios basados en los criterios de búsqueda
    const usuariosFiltrados = usuarios.filter((usuario) => {
        return (
            (idFilter === "" || usuario.idUsuario?.toString().includes(idFilter)) &&
            (nameFilter === "" || usuario.nombreUsuario.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (roleFilter === "" || usuario.rolId?.toString() === roleFilter)
        );
    });

    // Calcular la cantidad total de páginas
    const totalPages = Math.ceil(usuariosFiltrados.length / rowsPerPage);

    // Determinar los usuarios que se mostrarán en la página actual
    const startIndex = (currentPage - 1) * rowsPerPage;
    const usuariosPaginados = usuariosFiltrados.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-5xl mx-auto my-14">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-black">ID Usuario</th>
                        <th className="px-6 py-3 text-black">Nombre</th>
                        <th className="px-6 py-3 text-black">Rol</th>
                        <th className="px-10 py-3 text-right text-black">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosPaginados.length > 0 ? (
                        usuariosPaginados.map((usuario) => (
                            <tr key={usuario.idUsuario ?? Math.random()} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{usuario.idUsuario}</td>
                                <td className="px-6 py-4">{usuario.nombreUsuario}</td>
                                <td className="px-6 py-4">{ROLES_MAP[usuario.rolId || 0]}</td>
                                <td className="px-6 py-4 text-right flex space-x-2 justify-end">
                                    <button
                                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        onClick={() => onEdit(usuario.idUsuario!)}
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                        onClick={() => onDelete(usuario.idUsuario!)}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                No se encontraron usuarios.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 🔹 Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center bg-white">
                    <nav>
                        <ul className="inline-flex -space-x-px text-base h-10 m-8">
                            {/* Botón "Anterior" */}
                            <li>
                                <button
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center px-4 h-10 border border-gray-300 rounded-s-lg ${
                                        currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                                >
                                    Anterior
                                </button>
                            </li>

                            {/* Números de página */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li key={page}>
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`flex items-center justify-center px-4 h-10 border border-gray-300 ${
                                            currentPage === page ? "text-blue-600 bg-blue-50" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}

                            {/* Botón "Siguiente" */}
                            <li>
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center justify-center px-4 h-10 border border-gray-300 rounded-e-lg ${
                                        currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}

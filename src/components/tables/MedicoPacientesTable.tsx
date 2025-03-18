import { useState } from "react";
import { Paciente } from "../../types/paciente";

interface MedicoPacientesTableProps {
    pacientes: Paciente[];
    idFilter: string;
    nameFilter: string;
    emailFilter: string;
    currentPage: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function MedicoPacientesTable({
    pacientes,
    idFilter,
    nameFilter,
    emailFilter,
    currentPage,
    rowsPerPage,
    onPageChange
}: MedicoPacientesTableProps) {

    // Filtrar pacientes basados en los criterios de búsqueda
    const pacientesFiltrados = pacientes.filter((paciente) => {
        return (
            (idFilter === "" || paciente.idPaciente?.toString().includes(idFilter)) &&
            (nameFilter === "" || paciente.nombre.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (emailFilter === "" || paciente.correo.toLowerCase().includes(emailFilter.toLowerCase()))
        );
    });

    // Calcular la cantidad total de páginas
    const totalPages = Math.ceil(pacientesFiltrados.length / rowsPerPage);

    // Determinar los pacientes que se mostrarán en la página actual
    const startIndex = (currentPage - 1) * rowsPerPage;
    const pacientesPaginados = pacientesFiltrados.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-5xl mx-auto my-14">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-black">ID Paciente</th>
                        <th className="px-6 py-3 text-black">Nombre</th>
                        <th className="px-6 py-3 text-black">Correo</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientesPaginados.length > 0 ? (
                        pacientesPaginados.map((paciente) => (
                            <tr key={paciente.idPaciente ?? Math.random()} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{paciente.idPaciente}</td>
                                <td className="px-6 py-4">{paciente.nombre} {paciente.apellido}</td>
                                <td className="px-6 py-4">{paciente.correo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                No se encontraron pacientes.
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

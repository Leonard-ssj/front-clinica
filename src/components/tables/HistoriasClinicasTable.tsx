import { HistoriaClinica } from "../../types/historiaClinica";

interface HistoriasClinicasTableProps {
    historias: HistoriaClinica[];
    idFilter: string;
    nameFilter: string;
    dateFilter: string;
    currentPage: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function HistoriasClinicasTable({
    historias,
    idFilter,
    nameFilter,
    dateFilter,
    currentPage,
    rowsPerPage,
    onPageChange
}: HistoriasClinicasTableProps) {
    
    // Aplicar filtros
    const historiasFiltradas = historias.filter((historia) => {
        return (
            (idFilter === "" || historia.idHistoria?.toString().includes(idFilter)) &&
            (nameFilter === "" || historia.paciente.nombre.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (dateFilter === "" || historia.fechaUltimaActualizacion === dateFilter)
        );
    });

    // Calcular total de páginas
    const totalPages = Math.ceil(historiasFiltradas.length / rowsPerPage);

    // Obtener las historias de la página actual
    const startIndex = (currentPage - 1) * rowsPerPage;
    const historiasPaginadas = historiasFiltradas.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-5xl mx-auto my-14">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-black">ID Historia</th>
                        <th className="px-6 py-3 text-black">Paciente</th>
                        <th className="px-6 py-3 text-black">Fecha de Última Actualización</th>
                        <th className="px-6 py-3 text-black">Notas Médicas</th>
                    </tr>
                </thead>
                <tbody>
                    {historiasPaginadas.length > 0 ? (
                        historiasPaginadas.map((historia) => (
                            <tr key={historia.idHistoria} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{historia.idHistoria}</td>
                                <td className="px-6 py-4">{historia.paciente.nombre} {historia.paciente.apellido}</td>
                                <td className="px-6 py-4">{historia.fechaUltimaActualizacion}</td>
                                <td className="px-6 py-4">{historia.notasMedicas}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                No hay historias clínicas registradas.
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
                                    className={`flex items-center justify-center px-4 h-10 border border-gray-300 rounded-s-lg ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
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
                                        className={`flex items-center justify-center px-4 h-10 border border-gray-300 ${currentPage === page ? "text-blue-600 bg-blue-50" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
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
                                    className={`flex items-center justify-center px-4 h-10 border border-gray-300 rounded-e-lg ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
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

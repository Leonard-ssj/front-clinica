import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Medicamento } from "../../types/medicamento";

interface MedicamentosTableProps {
    medicamentos: Medicamento[];
    idFilter: string;
    nameFilter: string;
    descFilter: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    currentPage: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function MedicamentosTable({
    medicamentos,
    idFilter,
    nameFilter,
    descFilter,
    onEdit,
    onDelete,
    currentPage,
    rowsPerPage,
    onPageChange,
}: MedicamentosTableProps) {

    const medicamentosFiltrados = medicamentos.filter((medicamento) => {
        return (
            (idFilter === "" || medicamento.idMedicamento?.toString().includes(idFilter)) &&
            (nameFilter === "" || medicamento.nombre.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (descFilter === "" || medicamento.descripcion.toLowerCase().includes(descFilter.toLowerCase()))
        );
    });

    const totalPages = Math.ceil(medicamentosFiltrados.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const medicamentosPaginados = medicamentosFiltrados.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-5xl mx-auto my-14">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-black">ID</th>
                        <th className="px-6 py-3 text-black">Nombre</th>
                        <th className="px-6 py-3 text-black">Descripción</th>
                        <th className="px-6 py-3 text-black">Dosis</th>
                        <th className="px-6 py-3 text-black">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {medicamentosPaginados.map((medicamento) => (
                        <tr key={medicamento.idMedicamento} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{medicamento.idMedicamento}</td>
                            <td className="px-6 py-4">{medicamento.nombre}</td>
                            <td className="px-6 py-4">{medicamento.descripcion}</td>
                            <td className="px-6 py-4">{medicamento.dosisRecomendada}</td>
                            <td className="px-6 py-4 text-right flex space-x-2 justify-end">
                                <button
                                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    onClick={() => onEdit(medicamento.idMedicamento!)}
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button
                                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                    onClick={() => onDelete(medicamento.idMedicamento!)}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex justify-center bg-white">
                    <nav>
                        <ul className="inline-flex -space-x-px text-base h-10 m-8">
                            <li>
                                <button
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 h-10 border rounded-s-lg ${
                                        currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                                >
                                    Anterior
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li key={page}>
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`px-4 h-10 border ${
                                            currentPage === page ? "text-blue-600 bg-blue-50" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 h-10 border rounded-e-lg ${
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

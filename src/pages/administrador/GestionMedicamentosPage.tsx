import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import MedicamentosTable from "../../components/tables/MedicamentosTable";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import MedicamentoFormModal from "../../components/ui/MedicamentoFormModal";
import NuevoMedicamentoModal from "../../components/ui/NuevoMedicamentoModal";
import { obtenerMedicamentos, eliminarMedicamento } from "../../services/medicamentosService";
import { Medicamento } from "../../types/medicamento";

export default function GestionMedicamentosPage() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [idFilter, setIdFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [descFilter, setDescFilter] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewMedicamentoModalOpen, setIsNewMedicamentoModalOpen] = useState(false);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<Medicamento | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [medicamentoAEliminar, setMedicamentoAEliminar] = useState<number | null>(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchMedicamentos();
    }, []);

    async function fetchMedicamentos() {
        const data = await obtenerMedicamentos();
        setMedicamentos(data);
    }

    async function handleEditMedicamento(id: number) {
        const medicamento = medicamentos.find((m) => m.idMedicamento === id);
        if (medicamento) {
            setMedicamentoSeleccionado(medicamento);
            setIsModalOpen(true);
        }
    }

    function confirmDeleteMedicamento(id: number) {
        setMedicamentoAEliminar(id);
        setIsDeleteModalOpen(true);
    }

    async function handleDeleteMedicamento() {
        if (medicamentoAEliminar !== null) {
            try {
                await eliminarMedicamento(medicamentoAEliminar);
                fetchMedicamentos();
            } catch (error) {
                console.error("Error eliminando medicamento:", error);
            }
        }
        setIsDeleteModalOpen(false);
    }

    function handleOpenNewMedicamentoModal() {
        setIsNewMedicamentoModalOpen(true);
    }

    function handleCloseNewMedicamentoModal() {
        setIsNewMedicamentoModalOpen(false);
    }

    function clearFilters() {
        setIdFilter("");
        setNameFilter("");
        setDescFilter("");
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-14 my-10">
                <h1 className="text-4xl font-bold text-black">Gestión de Medicamentos</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-14"
                    onClick={handleOpenNewMedicamentoModal}
                >
                    Agregar Medicamento
                </button>
            </div>

            {/* 🔍 Filtros */}
            <div className="grid grid-cols-4 gap-5 mx-14">
                <input
                    type="number"
                    placeholder="Filtrar por ID"
                    value={idFilter}
                    onChange={(e) => setIdFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                    placeholder="Filtrar por Nombre"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                    placeholder="Filtrar por Descripción"
                    value={descFilter}
                    onChange={(e) => setDescFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={clearFilters}
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* Tabla de medicamentos */}
            <MedicamentosTable
                medicamentos={medicamentos}
                idFilter={idFilter}
                nameFilter={nameFilter}
                descFilter={descFilter}
                onEdit={handleEditMedicamento}
                onDelete={confirmDeleteMedicamento}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
            />

            {/* Modales */}
            <NuevoMedicamentoModal isOpen={isNewMedicamentoModalOpen} onClose={handleCloseNewMedicamentoModal} onMedicamentoCreated={fetchMedicamentos} />
            <MedicamentoFormModal isOpen={isModalOpen && medicamentoSeleccionado !== null} onClose={() => setIsModalOpen(false)} medicamento={medicamentoSeleccionado} onSubmit={fetchMedicamentos} />
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteMedicamento} message="¿Estás seguro de que deseas eliminar este medicamento?" />
        </AdminLayout>
    );
}

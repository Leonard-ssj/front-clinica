import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import PacientesTable from "../../components/tables/PacientesTable";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import PacienteFormModal from "../../components/ui/PacienteFormModal";
import NuevoPacienteModal from "../../components/ui/NuevoPacienteModal";
import { obtenerPacientes, eliminarPaciente, obtenerPacientePorId, actualizarPaciente } from "../../services/pacientesService";
import { Paciente } from "../../types/paciente";

export default function GestionPacientesPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [idFilter, setIdFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [emailFilter, setEmailFilter] = useState<string>("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewPacienteModalOpen, setIsNewPacienteModalOpen] = useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pacienteAEliminar, setPacienteAEliminar] = useState<number | null>(null);

    useEffect(() => {
        fetchPacientes();
    }, []);

    async function fetchPacientes() {
        const data = await obtenerPacientes();
        setPacientes(data);
    }

    async function handleEditPaciente(id: number) {
        try {
            const paciente = await obtenerPacientePorId(id);
            setPacienteSeleccionado(paciente);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error obteniendo datos del paciente:", error);
        }
    }

    function confirmDeletePaciente(id: number) {
        setPacienteAEliminar(id);
        setIsDeleteModalOpen(true);
    }

    async function handleDeletePaciente() {
        if (pacienteAEliminar !== null) {
            try {
                await eliminarPaciente(pacienteAEliminar);
                fetchPacientes();
            } catch (error) {
                console.error("Error eliminando paciente:", error);
            }
        }
        setIsDeleteModalOpen(false);
    }

    async function handleSavePaciente(updatedPaciente: Paciente) {
        try {
            await actualizarPaciente(updatedPaciente.idPaciente!, updatedPaciente);
            setIsModalOpen(false);
            fetchPacientes();
        } catch (error) {
            console.error("Error guardando paciente:", error);
        }
    }

    function handleOpenNewPacienteModal() {
        setIsNewPacienteModalOpen(true);
    }

    function handleCloseNewPacienteModal() {
        setIsNewPacienteModalOpen(false);
    }

    function clearFilters() {
        setIdFilter("");
        setNameFilter("");
        setEmailFilter("");
        setCurrentPage(1);
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-14 my-10">
                <h1 className="text-4xl font-bold text-black">Gestión de Pacientes</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-14"
                    onClick={handleOpenNewPacienteModal}>
                    Agregar Paciente
                </button>
            </div>

            {/* 🔍 Filtros */}
            <div className="grid grid-cols-4 gap-5 mx-14">
                <input
                    type="number"
                    placeholder="Filtrar por ID"
                    value={idFilter}
                    onChange={(e) => {
                        setIdFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="text"
                    placeholder="Filtrar por Nombre"
                    value={nameFilter}
                    onChange={(e) => {
                        setNameFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="email"
                    placeholder="Filtrar por Correo"
                    value={emailFilter}
                    onChange={(e) => {
                        setEmailFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={clearFilters}>
                    Limpiar Filtros
                </button>
            </div>

            {/* Tabla de pacientes */}
            <PacientesTable
                pacientes={pacientes}
                idFilter={idFilter}
                nameFilter={nameFilter}
                emailFilter={emailFilter}
                onEdit={handleEditPaciente}
                onDelete={confirmDeletePaciente}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
            />

            {/* Modales */}
            <NuevoPacienteModal isOpen={isNewPacienteModalOpen} onClose={handleCloseNewPacienteModal} onPacienteCreated={fetchPacientes} />
            <PacienteFormModal isOpen={isModalOpen && pacienteSeleccionado !== null} onClose={() => setIsModalOpen(false)} paciente={pacienteSeleccionado} onSubmit={handleSavePaciente} />
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeletePaciente} message="¿Estás seguro de que deseas eliminar este paciente?" />
        </AdminLayout>
    );
}

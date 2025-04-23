import { useState, useEffect } from "react";
import MedicoLayout from "../../components/layout/MedicoLayout";
import HistoriasClinicasTable from "../../components/tables/HistoriasClinicasTable";
import NuevoHistoriaClinicaModal from "../../components/ui/NuevoHistoriaClinicaModal";
import NuevoTratamientoModal from "../../components/ui/NuevoTratamientoModal";
import EditarTratamientoModal from "../../components/ui/EditarTratamientoModal"; // Importamos el modal de edición
import { obtenerHistoriasClinicas } from "../../services/historiasClinicasService";
import { HistoriaClinica } from "../../types/historiaClinica";

export default function GestionHistoriasClinicasPage() {
    const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
    const [idFilter, setIdFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const [isNewHistoriaModalOpen, setIsNewHistoriaModalOpen] = useState(false);
    const [isNewTratamientoModalOpen, setIsNewTratamientoModalOpen] = useState(false);
    const [isEditTratamientoModalOpen, setIsEditTratamientoModalOpen] = useState(false);
    
    const [selectedHistoriaClinica, setSelectedHistoriaClinica] = useState<number | null>(null);
    const [selectedTratamiento, setSelectedTratamiento] = useState<number | null>(null);

    
    useEffect(() => {
        fetchHistoriasClinicas();
    }, []);

    async function fetchHistoriasClinicas() {
        try {
            const data = await obtenerHistoriasClinicas();
            setHistorias(data);
        } catch (error) {
            console.error("Error al obtener historias clínicas:", error);
        }
    }

    function handleOpenNewHistoriaModal() {
        setIsNewHistoriaModalOpen(true);
    }

    function handleCloseNewHistoriaModal() {
        setIsNewHistoriaModalOpen(false);
    }

    function handleOpenNuevoTratamientoModal(idHistoria: number) {
        setSelectedHistoriaClinica(idHistoria);
        setIsNewTratamientoModalOpen(true);
    }

    function handleCloseNuevoTratamientoModal() {
        setIsNewTratamientoModalOpen(false);
        setSelectedHistoriaClinica(null);
    }

    function handleOpenEditarTratamientoModal(idHistoria: number, idTratamiento: number) {
        setSelectedHistoriaClinica(idHistoria);
        setSelectedTratamiento(idTratamiento);
        setIsEditTratamientoModalOpen(true);
    }

    function handleCloseEditarTratamientoModal() {
        setIsEditTratamientoModalOpen(false);
        setSelectedHistoriaClinica(null);
        setSelectedTratamiento(null);
    }

    function clearFilters() {
        setIdFilter("");
        setNameFilter("");
        setDateFilter("");
        setCurrentPage(1);
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    return (
        <MedicoLayout>
            <div className="flex justify-between items-center mb-14 my-10">
                <h1 className="text-4xl font-bold text-black">Gestión de Historias Clínicas</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-14"
                    onClick={handleOpenNewHistoriaModal}
                >
                    Agregar Historia Clínica
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
                    placeholder="Filtrar por Paciente"
                    value={nameFilter}
                    onChange={(e) => {
                        setNameFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                        setDateFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={clearFilters}
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* Tabla de historias clínicas */}
            <HistoriasClinicasTable
                historias={historias}
                idFilter={idFilter}
                nameFilter={nameFilter}
                dateFilter={dateFilter}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onAgregarTratamiento={handleOpenNuevoTratamientoModal}
                onEditarTratamiento={handleOpenEditarTratamientoModal}
            />

            {/* Modales */}
            <NuevoHistoriaClinicaModal
                isOpen={isNewHistoriaModalOpen}
                onClose={handleCloseNewHistoriaModal}
                onHistoriaCreated={fetchHistoriasClinicas}
            />

            <NuevoTratamientoModal
                isOpen={isNewTratamientoModalOpen}
                onClose={handleCloseNuevoTratamientoModal}
                idHistoriaClinica={selectedHistoriaClinica!}
                onTratamientoCreated={fetchHistoriasClinicas}
            />

            <EditarTratamientoModal
                isOpen={isEditTratamientoModalOpen}
                onClose={handleCloseEditarTratamientoModal}
                idTratamiento={selectedTratamiento!}
                onTratamientoUpdated={fetchHistoriasClinicas}
            />
        </MedicoLayout>
    );
}

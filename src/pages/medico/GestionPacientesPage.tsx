import { useState, useEffect } from "react";
import MedicoLayout from "../../components/layout/MedicoLayout";
import MedicoPacientesTable from "../../components/tables/MedicoPacientesTable";
import { obtenerPacientes } from "../../services/pacientesService";
import { Paciente } from "../../types/paciente";

export default function GestionPacientesPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [idFilter, setIdFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [emailFilter, setEmailFilter] = useState<string>("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchPacientes();
    }, []);

    async function fetchPacientes() {
        const data = await obtenerPacientes();
        setPacientes(data);
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
        <MedicoLayout>
            <div className="flex justify-between items-center mb-14 my-10">
                <h1 className="text-4xl font-bold text-black">Gestión de Pacientes</h1>
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
            <MedicoPacientesTable
                pacientes={pacientes}
                idFilter={idFilter}
                nameFilter={nameFilter}
                emailFilter={emailFilter}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
            />
        </MedicoLayout>
    );
}

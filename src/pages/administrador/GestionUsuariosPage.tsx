import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import UsuariosTable from "../../components/tables/UsuariosTable";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import UsuarioFormModal from "../../components/ui/UsuarioFormModal";
import NuevoUsuarioModal from "../../components/ui/NuevoUsuarioModal";
import { obtenerUsuarios, obtenerUsuarioParaEdicion, eliminarUsuario, actualizarUsuario } from "../../services/usuariosService";
import { Usuario } from "../../types/usuario";

export default function GestionUsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [idFilter, setIdFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<number | null>(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    async function fetchUsuarios() {
        const data = await obtenerUsuarios();
        setUsuarios(data);
    }

    async function handleEditUser(id: number) {
        try {
            const usuario = await obtenerUsuarioParaEdicion(id);
            setUsuarioSeleccionado(usuario);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error obteniendo datos del usuario:", error);
        }
    }

    function confirmDeleteUser(id: number) {
        setUsuarioAEliminar(id);
        setIsDeleteModalOpen(true);
    }

    async function handleDeleteUser() {
        if (usuarioAEliminar !== null) {
            try {
                await eliminarUsuario(usuarioAEliminar);
                fetchUsuarios();
            } catch (error) {
                console.error("Error eliminando usuario:", error);
            }
        }
        setIsDeleteModalOpen(false);
    }

    async function handleSaveUser(updatedUser: Usuario) {
        try {
            const usuarioPayload: Partial<Usuario> = {
                nombreUsuario: updatedUser.nombreUsuario,
                rolId: updatedUser.rolId,
            };

            if (updatedUser.contraseña && updatedUser.contraseña.length >= 6) {
                usuarioPayload.contraseña = updatedUser.contraseña;
            }

            await actualizarUsuario(updatedUser.idUsuario!, usuarioPayload);
            setIsModalOpen(false);
            fetchUsuarios();
        } catch (error) {
            console.error("Error guardando usuario:", error);
        }
    }

    function handleOpenNewUserModal() {
        setIsNewUserModalOpen(true);
    }

    function handleCloseNewUserModal() {
        setIsNewUserModalOpen(false);
    }

    function clearFilters() {
        setIdFilter("");
        setNameFilter("");
        setRoleFilter("");
        setCurrentPage(1); // Reset paginación al limpiar filtros
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-14 my-10">
                <h1 className="text-4xl font-bold text-black">Gestión de Usuarios</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-14"
                    onClick={handleOpenNewUserModal}>
                    Agregar Usuario
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
                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Todos los roles</option>
                    <option value="1">Administrador</option>
                    <option value="2">Médico</option>
                    <option value="3">Enfermera</option>
                </select>
                <button
                    className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={clearFilters}>
                    Limpiar Filtros
                </button>
            </div>

            {/* Tabla de usuarios */}
            <UsuariosTable
                usuarios={usuarios}
                idFilter={idFilter}
                nameFilter={nameFilter}
                roleFilter={roleFilter}
                onEdit={handleEditUser}
                onDelete={confirmDeleteUser}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
            />

            {/* Modales */}
            <NuevoUsuarioModal isOpen={isNewUserModalOpen} onClose={handleCloseNewUserModal} onUserCreated={fetchUsuarios} />
            <UsuarioFormModal isOpen={isModalOpen && usuarioSeleccionado !== null} onClose={() => setIsModalOpen(false)} usuario={usuarioSeleccionado} onSubmit={handleSaveUser} />
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteUser} message="¿Estás seguro de que deseas eliminar este usuario?" />
        </AdminLayout>
    );
}

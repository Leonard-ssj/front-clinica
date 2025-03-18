import { useState } from "react";
import { crearUsuario } from "../../services/usuariosService";

interface NuevoUsuarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

export default function NuevoUsuarioModal({ isOpen, onClose, onUserCreated }: NuevoUsuarioModalProps) {
    if (!isOpen) return null; // Evita renderizar si no está abierto

    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [rolId, setRolId] = useState("1");
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        // Validaciones
        if (nombreUsuario.length < 5) {
            setError("El nombre de usuario debe tener al menos 5 caracteres.");
            return;
        }
        if (contraseña.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            // ✅ Llamamos a la API para crear el usuario
            await crearUsuario({
                nombreUsuario,
                contraseña,
                rolId: Number(rolId),
            });

            // ✅ Mostramos mensaje de éxito
            setMensajeExito("Usuario creado exitosamente.");
            setError(null);

            // Limpiar formulario
            setNombreUsuario("");
            setContraseña("");
            setRolId("1");

            // Recargar la tabla de usuarios
            onUserCreated();

            // ✅ Cerrar modal después de 2 segundos
            setTimeout(() => {
                setMensajeExito(null);
                onClose();
            }, 2000);

        } catch (error) {
            setError("Error al crear usuario. Intenta de nuevo.");
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Agregar Usuario</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
                        ✖
                    </button>
                </div>

                {/* Alertas */}
                {mensajeExito && (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                        {mensajeExito}
                    </div>
                )}
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contraseña</label>
                        <input
                            type="password"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Rol</label>
                        <select
                            value={rolId}
                            onChange={(e) => setRolId(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="1">Administrador</option>
                            <option value="2">Médico</option>
                            <option value="3">Enfermera</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

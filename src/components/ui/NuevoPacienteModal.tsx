import { useState } from "react";
import { crearPaciente } from "../../services/pacientesService";

interface NuevoPacienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPacienteCreated: () => void;
}

export default function NuevoPacienteModal({ isOpen, onClose, onPacienteCreated }: NuevoPacienteModalProps) {
    if (!isOpen) return null;

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (nombre.length < 3) {
            setError("El nombre debe tener al menos 3 caracteres.");
            return;
        }
        if (apellido.length < 3) {
            setError("El apellido debe tener al menos 3 caracteres.");
            return;
        }
        if (!fechaNacimiento) {
            setError("La fecha de nacimiento es obligatoria.");
            return;
        }
        if (telefono.length < 10) {
            setError("El teléfono debe tener al menos 10 dígitos.");
            return;
        }
        if (!correo.includes("@")) {
            setError("Ingrese un correo válido.");
            return;
        }

        try {
            await crearPaciente({
                nombre,
                apellido,
                fechaNacimiento,
                telefono,
                correo,
            });

            setMensajeExito("Paciente creado exitosamente.");
            setError(null);

            setNombre("");
            setApellido("");
            setFechaNacimiento("");
            setTelefono("");
            setCorreo("");

            onPacienteCreated();

            setTimeout(() => {
                setMensajeExito(null);
                onClose();
            }, 2000);

        } catch (error) {
            setError("Error al crear paciente. Intenta de nuevo.");
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Agregar Paciente</h3>
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
                        <label className="block text-sm font-medium">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Teléfono</label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Correo</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
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
                            Crear Paciente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

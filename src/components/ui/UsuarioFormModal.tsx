import { useState, useEffect } from "react";
import { Usuario } from "../../types/usuario";

interface UsuarioFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onSubmit: (data: Usuario) => void;
}

export default function UsuarioFormModal({ isOpen, onClose, usuario, onSubmit }: UsuarioFormModalProps) {

    const [form, setForm] = useState<Usuario>({
        idUsuario: null,
        nombreUsuario: "",
        contraseña: "",
        rolId: null,
    });
    

    const [errorContraseña, setErrorContraseña] = useState<string>("");

    useEffect(() => {
        if (!usuario) return; // Si usuario es null o undefined, salimos
    
        setForm({
            idUsuario: usuario.idUsuario ?? null,
            nombreUsuario: usuario.nombreUsuario ?? "",
            contraseña: "",
            rolId: usuario.rolId ?? null,
        });
    }, [usuario]);
    
    


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validar la contraseña antes de enviar
        if (form.contraseña && form.contraseña.length < 6) {
            setErrorContraseña("La contraseña debe tener al menos 6 caracteres.");
            return;
        } else {
            setErrorContraseña(""); // Limpiar error si es válido
        }

        onSubmit(form);
    }

    if (!isOpen || usuario === null) return null; // Evita renderizar si no hay datos
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-2xl font-semibold text-black">Editar Usuario</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
                        ✖
                    </button>
                </div>

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={form.nombreUsuario}
                            onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contraseña (Opcional)</label>
                        <input
                            type="password"
                            value={form.contraseña ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setForm({ ...form, contraseña: value });

                                // Validar en tiempo real
                                if (value && value.length < 6) {
                                    setErrorContraseña("La contraseña debe tener al menos 6 caracteres.");
                                } else {
                                    setErrorContraseña("");
                                }
                            }}
                            className="w-full p-2 border rounded-lg"
                        />
                        {errorContraseña && <p className="text-red-500 text-xs mt-1">{errorContraseña}</p>}
                        <p className="text-xs text-gray-500 mt-1">Si no quieres cambiarla, deja este campo vacío.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Rol</label>
                        <select
                            value={form.rolId ?? ""}
                            onChange={(e) => setForm({ ...form, rolId: Number(e.target.value) })}
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
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-lg text-white ${errorContraseña ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={!!errorContraseña}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

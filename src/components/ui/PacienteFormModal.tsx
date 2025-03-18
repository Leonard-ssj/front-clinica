import { useState, useEffect } from "react";
import { Paciente } from "../../types/paciente";

interface PacienteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    paciente: Paciente | null;
    onSubmit: (data: Paciente) => void;
}

export default function PacienteFormModal({ isOpen, onClose, paciente, onSubmit }: PacienteFormModalProps) {

    const [form, setForm] = useState<Paciente>({
        idPaciente: null,
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        telefono: "",
        correo: ""
    });

    useEffect(() => {
        if (!paciente) return;

        setForm({
            idPaciente: paciente.idPaciente ?? null,
            nombre: paciente.nombre ?? "",
            apellido: paciente.apellido ?? "",
            fechaNacimiento: paciente.fechaNacimiento ?? "",
            telefono: paciente.telefono ?? "",
            correo: paciente.correo ?? ""
        });
    }, [paciente]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(form);
    }

    if (!isOpen || paciente === null) return null; 

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-2xl font-semibold text-black">Editar Paciente</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
                        ✖
                    </button>
                </div>

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Apellido</label>
                        <input
                            type="text"
                            value={form.apellido}
                            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            value={form.fechaNacimiento}
                            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Teléfono</label>
                        <input
                            type="tel"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Correo</label>
                        <input
                            type="email"
                            value={form.correo}
                            onChange={(e) => setForm({ ...form, correo: e.target.value })}
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
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

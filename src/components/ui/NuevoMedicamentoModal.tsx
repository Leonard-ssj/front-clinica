import { useState } from "react";
import { crearMedicamento } from "../../services/medicamentosService";

interface NuevoMedicamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMedicamentoCreated: () => void;
}

export default function NuevoMedicamentoModal({ isOpen, onClose, onMedicamentoCreated }: NuevoMedicamentoModalProps) {
    if (!isOpen) return null;

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [contraindicaciones, setContraindicaciones] = useState("");
    const [dosisRecomendada, setDosisRecomendada] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (nombre.length < 3) {
            setError("El nombre debe tener al menos 3 caracteres.");
            return;
        }
        if (descripcion.length < 5) {
            setError("La descripción debe tener al menos 5 caracteres.");
            return;
        }
        if (dosisRecomendada.length < 3) {
            setError("La dosis recomendada es obligatoria.");
            return;
        }

        try {
            await crearMedicamento({
                nombre,
                descripcion,
                contraindicaciones,
                dosisRecomendada,
            });

            setMensajeExito("Medicamento agregado correctamente.");
            setError(null);

            setNombre("");
            setDescripcion("");
            setContraindicaciones("");
            setDosisRecomendada("");

            onMedicamentoCreated();

            setTimeout(() => {
                setMensajeExito(null);
                onClose();
            }, 2000);
        } catch (error) {
            setError("Error al agregar medicamento. Intenta de nuevo.");
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Agregar Medicamento</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
                        ✖
                    </button>
                </div>

                {/* Alertas */}
                {mensajeExito && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">{mensajeExito}</div>}
                {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Descripción</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Contraindicaciones</label>
                        <textarea value={contraindicaciones} onChange={(e) => setContraindicaciones(e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Dosis Recomendada</label>
                        <input type="text" value={dosisRecomendada} onChange={(e) => setDosisRecomendada(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Agregar Medicamento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

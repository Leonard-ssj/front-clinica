import { useState, useEffect } from "react";
import { Medicamento } from "../../types/medicamento";
import { actualizarMedicamento } from "../../services/medicamentosService";

interface MedicamentoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    medicamento: Medicamento | null;
    onSubmit: () => void;
}

export default function MedicamentoFormModal({ isOpen, onClose, medicamento, onSubmit }: MedicamentoFormModalProps) {
    const [form, setForm] = useState<Medicamento>({
        idMedicamento: null,
        nombre: "",
        descripcion: "",
        contraindicaciones: "",
        dosisRecomendada: "",
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (medicamento) {
            setForm(medicamento);
        }
    }, [medicamento]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (form.nombre.length < 3) {
            setError("El nombre debe tener al menos 3 caracteres.");
            return;
        }
        if (form.descripcion.length < 5) {
            setError("La descripción debe tener al menos 5 caracteres.");
            return;
        }
        if (form.dosisRecomendada.length < 3) {
            setError("La dosis recomendada es obligatoria.");
            return;
        }

        await actualizarMedicamento(form.idMedicamento!, form);
        onSubmit();
        onClose();
    }

    if (!isOpen || medicamento === null) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold">Editar Medicamento</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
                        ✖
                    </button>
                </div>

                {/* Alertas */}
                {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Descripción</label>
                        <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Contraindicaciones</label>
                        <textarea value={form.contraindicaciones} onChange={(e) => setForm({ ...form, contraindicaciones: e.target.value })} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Dosis Recomendada</label>
                        <input type="text" value={form.dosisRecomendada} onChange={(e) => setForm({ ...form, dosisRecomendada: e.target.value })} className="w-full p-2 border rounded-lg" required />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>
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

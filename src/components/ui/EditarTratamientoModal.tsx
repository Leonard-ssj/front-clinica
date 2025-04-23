import { useState, useEffect } from "react";
import {
    obtenerTratamientoPorId,
    actualizarTratamiento,
    agregarMedicamentosATratamiento,
    eliminarMedicamentoDeTratamiento
} from "../../services/tratamientosService";
import { obtenerMedicamentos } from "../../services/medicamentosService";
import { Tratamiento } from "../../types/tratamiento";
import { Medicamento } from "../../types/medicamento";

interface EditarTratamientoModalProps {
    isOpen: boolean;
    onClose: () => void;
    idTratamiento: number;
    onTratamientoUpdated: () => void;
}

export default function EditarTratamientoModal({
    isOpen,
    onClose,
    idTratamiento,
    onTratamientoUpdated
}: EditarTratamientoModalProps) {

    const [tratamiento, setTratamiento] = useState<Tratamiento | null>(null);
    const [medicamentosDisponibles, setMedicamentosDisponibles] = useState<Medicamento[]>([]);
    const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            async function fetchData() {
                try {
                    const tratamientoData = await obtenerTratamientoPorId(idTratamiento);
                    const medicamentosData = await obtenerMedicamentos();

                    setTratamiento(tratamientoData);
                    setMedicamentosDisponibles(medicamentosData);

                    // ✅ Marcar solo los medicamentos actuales del tratamiento
                    setMedicamentosSeleccionados(tratamientoData.medicamentos.map(m => m.idMedicamento!));

                    setMensajeExito(null);
                } catch (error) {
                    console.error("Error obteniendo datos del tratamiento:", error);
                }
            }
            fetchData();
        }
    }, [isOpen, idTratamiento]);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!tratamiento) return;

        try {
            await actualizarTratamiento(idTratamiento, {
                fechaInicio: tratamiento.fechaInicio,
                fechaFin: tratamiento.fechaFin,
                indicaciones: tratamiento.indicaciones
            });

            await agregarMedicamentosATratamiento(idTratamiento, medicamentosSeleccionados);

            setMensajeExito("Tratamiento actualizado correctamente.");
            setError(null);
            onTratamientoUpdated();

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            setError("Error al actualizar el tratamiento. Intenta de nuevo.");
        }
    }

    async function handleMedicamentoChange(id: number) {
        if (medicamentosSeleccionados.includes(id)) {
            // **Caso: Deseleccionar un medicamento -> Llamamos al endpoint DELETE**
            try {
                await eliminarMedicamentoDeTratamiento(idTratamiento, id);
                setMedicamentosSeleccionados(prev => prev.filter(m => m !== id));
                setTratamiento(prev => prev
                    ? { ...prev, medicamentos: prev.medicamentos.filter(m => m.idMedicamento !== id) }
                    : null
                );
            } catch (error) {
                console.error("Error al eliminar el medicamento:", error);
            }
        } else {
            // **Caso: Seleccionar un nuevo medicamento**
            setMedicamentosSeleccionados([...medicamentosSeleccionados, id]);
        }
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6"> {/* 📌 Más ancho */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Editar Tratamiento</h3>
                    <button
                        className="text-gray-400 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>

                {mensajeExito && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">{mensajeExito}</div>}
                {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

                {tratamiento && (
                    <form className="grid grid-cols-2 gap-6 mt-4" onSubmit={handleUpdate}> {/* 📌 Dos columnas */}
                        {/* Columna Izquierda: Datos Generales */}
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Fecha de Inicio</label>
                            <input type="date" value={tratamiento.fechaInicio} onChange={(e) => setTratamiento({ ...tratamiento, fechaInicio: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />

                            <label className="block text-sm font-medium text-blue-700 mt-4">Fecha de Fin</label>
                            <input type="date" value={tratamiento.fechaFin} onChange={(e) => setTratamiento({ ...tratamiento, fechaFin: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />

                            <label className="block text-sm font-medium text-blue-700 mt-4">Indicaciones</label>
                            <textarea value={tratamiento.indicaciones} onChange={(e) => setTratamiento({ ...tratamiento, indicaciones: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" rows={4} required />
                        </div>

                        {/* Columna Derecha: Medicamentos */}
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Medicamentos</label>
                            <div className="border rounded-lg p-2 max-h-60 overflow-y-auto">
                                {medicamentosDisponibles.map(medicamento => (
                                    <div key={medicamento.idMedicamento} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={medicamentosSeleccionados.includes(medicamento.idMedicamento!)}
                                            onChange={() => handleMedicamentoChange(medicamento.idMedicamento!)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-900">{medicamento.nombre}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="col-span-2 flex justify-end space-x-4 mt-4">
                            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar Cambios</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

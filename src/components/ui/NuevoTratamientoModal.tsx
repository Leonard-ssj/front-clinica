import { useState, useEffect } from "react";
import { obtenerMedicamentos } from "../../services/medicamentosService";
import { obtenerMedicos } from "../../services/usuariosService";
import { crearTratamiento } from "../../services/tratamientosService";
import { Medicamento } from "../../types/medicamento";
import { Usuario } from "../../types/usuario";

interface NuevoTratamientoModalProps {
    isOpen: boolean;
    onClose: () => void;
    idHistoriaClinica: number;
    onTratamientoCreated: () => void;
}

export default function NuevoTratamientoModal({
    isOpen,
    onClose,
    idHistoriaClinica,
    onTratamientoCreated
}: NuevoTratamientoModalProps) {

    // Estados
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [medicoSeleccionado, setMedicoSeleccionado] = useState<number | null>(null);
    const [medicos, setMedicos] = useState<Usuario[]>([]);
    const [medicamentosDisponibles, setMedicamentosDisponibles] = useState<Medicamento[]>([]);
    const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    // Establecer fecha de inicio automáticamente cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            const today = new Date().toISOString().split("T")[0];
            setFechaInicio(today);

            async function fetchData() {
                try {
                    const medicosData = await obtenerMedicos();
                    setMedicos(medicosData);

                    const medicamentosData = await obtenerMedicamentos();
                    setMedicamentosDisponibles(medicamentosData);
                } catch (error) {
                    console.error("Error obteniendo datos:", error);
                }
            }
            fetchData();
        }
    }, [isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!fechaInicio || !fechaFin || !indicaciones || !medicoSeleccionado || medicamentosSeleccionados.length === 0) {
            setError("Todos los campos son obligatorios y debes seleccionar un médico y al menos un medicamento.");
            return;
        }

        try {
            await crearTratamiento({
                historiaClinica: { idHistoria: idHistoriaClinica },
                medico: {
                    idUsuario: medicoSeleccionado,
                    nombreUsuario: medicos.find(m => m.idUsuario === medicoSeleccionado)?.nombreUsuario || "",
                    rolId: 2
                },
                fechaInicio,
                fechaFin,
                indicaciones,
                medicamentos: medicamentosDisponibles
                    .filter(med => medicamentosSeleccionados.includes(med.idMedicamento!))
                    .map(med => ({
                        idMedicamento: med.idMedicamento!,
                        nombre: med.nombre,
                        descripcion: med.descripcion,
                        contraindicaciones: med.contraindicaciones,
                        dosisRecomendada: med.dosisRecomendada
                    }))
            });

            setMensajeExito("Tratamiento agregado exitosamente.");
            setError(null);
            setFechaFin("");
            setIndicaciones("");
            setMedicoSeleccionado(null);
            setMedicamentosSeleccionados([]);

            onTratamientoCreated();

            setTimeout(() => {
                if (isOpen) {
                    setMensajeExito(null);
                    onClose();
                }
            }, 2000);
        } catch (error) {
            setError("Error al agregar el tratamiento. Intenta de nuevo.");
        }
    }

    function handleMedicamentoChange(id: number) {
        if (medicamentosSeleccionados.includes(id)) {
            setMedicamentosSeleccionados(medicamentosSeleccionados.filter(m => m !== id));
        } else {
            setMedicamentosSeleccionados([...medicamentosSeleccionados, id]);
        }
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="mt-20 bg-white rounded-lg shadow-md w-11/12 max-w-lg p-6 overflow-y-auto max-h-screen relative">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Agregar Tratamiento</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✖</button>
                </div>

                {/* Alertas */}
                {mensajeExito && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">{mensajeExito}</div>}
                {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    {/* Selección de médico */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Médico Responsable</label>
                        <select value={medicoSeleccionado ?? ""} onChange={(e) => setMedicoSeleccionado(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="">-- Selecciona un médico --</option>
                            {medicos.map((medico) => (
                                <option key={medico.idUsuario} value={medico.idUsuario ?? ""}>
                                    {medico.nombreUsuario}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fechas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Fecha de Inicio</label>
                        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full p-2 border rounded-lg text-gray-900" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">Fecha de Fin</label>
                        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full p-2 border rounded-lg text-gray-900" required />
                    </div>

                    {/* Indicaciones */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Indicaciones</label>
                        <textarea value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" rows={4} placeholder="Escribe las indicaciones..."></textarea>
                    </div>

                    {/* Selección de medicamentos */}
                    <div>
                        <label className="block text-sm font-medium">Seleccionar Medicamentos</label>
                        <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                            {medicamentosDisponibles.map((medicamento) => (
                                <div key={medicamento.idMedicamento} className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        id={`medicamento-${medicamento.idMedicamento}`}
                                        checked={medicamentosSeleccionados.includes(medicamento.idMedicamento!)}
                                        onChange={() => handleMedicamentoChange(medicamento.idMedicamento!)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                                    />
                                    <label htmlFor={`medicamento-${medicamento.idMedicamento}`} className="ms-2 text-sm font-medium text-gray-900">
                                        {medicamento.nombre} - {medicamento.dosisRecomendada}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Agregar Tratamiento</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

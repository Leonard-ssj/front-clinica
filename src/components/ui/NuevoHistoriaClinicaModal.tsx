import { useState, useEffect } from "react";
import { obtenerPacientes } from "../../services/pacientesService";
import { crearHistoriaClinica } from "../../services/historiasClinicasService";
import { Paciente } from "../../types/paciente";

interface NuevoHistoriaClinicaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onHistoriaCreated: () => void;
}

export default function NuevoHistoriaClinicaModal({
    isOpen,
    onClose,
    onHistoriaCreated
}: NuevoHistoriaClinicaModalProps) {

    console.log("Recibiendo isOpen en NuevoHistoriaClinicaModal:", isOpen);

    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<number | null>(null);
    const [notasMedicas, setNotasMedicas] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            console.log("Ejecutando useEffect para cargar pacientes...");
            async function fetchPacientes() {
                try {
                    const data = await obtenerPacientes();
                    setPacientes(data);
                } catch (error) {
                    console.error("Error obteniendo pacientes:", error);
                }
            }
            fetchPacientes();
        }
    }, [isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!selectedPaciente) {
            setError("Debes seleccionar un paciente.");
            return;
        }
        if (notasMedicas.trim().length < 10) {
            setError("Las notas médicas deben tener al menos 10 caracteres.");
            return;
        }

        try {
            const pacienteSeleccionado = pacientes.find(p => p.idPaciente === selectedPaciente);
            if (!pacienteSeleccionado) {
                setError("Paciente no encontrado.");
                return;
            }

            await crearHistoriaClinica({
                paciente: {
                    idPaciente: pacienteSeleccionado.idPaciente ?? 0,
                    nombre: pacienteSeleccionado.nombre,
                    apellido: pacienteSeleccionado.apellido,
                    fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
                    telefono: pacienteSeleccionado.telefono,
                    correo: pacienteSeleccionado.correo
                },
                notasMedicas,
                fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
            });

            setMensajeExito("Historia clínica creada exitosamente.");
            setError(null);
            setNotasMedicas("");
            setSelectedPaciente(null);

            onHistoriaCreated();

            setTimeout(() => {
                if (isOpen) {
                    setMensajeExito(null);
                    onClose();
                }
            }, 2000);
        } catch (error) {
            setError("Error al crear historia clínica. Intenta de nuevo.");
        }
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Agregar Historia Clínica</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✖</button>
                </div>

                {/* Alertas */}
                {mensajeExito && <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">{mensajeExito}</div>}
                {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

                {/* Formulario */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Seleccionar Paciente</label>
                        <select
                            value={selectedPaciente ?? ""}
                            onChange={(e) => setSelectedPaciente(e.target.value ? Number(e.target.value) : null)}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="">-- Selecciona un paciente --</option>
                            {pacientes.map((paciente) => (
                                <option key={paciente.idPaciente} value={paciente.idPaciente ?? ""}>
                                    {paciente.nombre} {paciente.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Notas Médicas</label>
                        <textarea value={notasMedicas} onChange={(e) => setNotasMedicas(e.target.value)} className="w-full p-2 border rounded-lg" rows={3} required />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Crear Historia Clínica</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

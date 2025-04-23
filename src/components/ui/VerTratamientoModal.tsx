import { useState, useEffect } from "react";
import { obtenerHistoriaClinicaPorId } from "../../services/historiasClinicasService";
import { HistoriaClinica } from "../../types/historiaClinica";

interface VerTratamientoModalProps {
    isOpen: boolean;
    onClose: () => void;
    idHistoria: number;
}

export default function VerTratamientoModal({ isOpen, onClose, idHistoria }: VerTratamientoModalProps) {
    const [historia, setHistoria] = useState<HistoriaClinica | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            async function fetchHistoria() {
                try {
                    const data = await obtenerHistoriaClinicaPorId(idHistoria);
                    setHistoria(data);
                } catch (error) {
                    setError("Error al obtener los datos de la historia clínica.");
                }
            }
            fetchHistoria();
        }
    }, [isOpen, idHistoria]);

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-md w-full max-w-3xl p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-semibold text-black">Detalles de la Historia Clínica</h3>
                    <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>✖</button>
                </div>

                {error && <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>}

                {historia && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-blue-700">Paciente:</h4>
                        <p className="text-gray-700">{historia.paciente.nombre} {historia.paciente.apellido}</p>
                        <p className="text-gray-700">Teléfono: {historia.paciente.telefono}</p>
                        <p className="text-gray-700">Correo: {historia.paciente.correo}</p>

                        <h4 className="text-lg font-semibold text-blue-700 mt-4">Notas Médicas:</h4>
                        <p className="text-gray-700">{historia.notasMedicas}</p>

                        {historia.tratamientos.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-blue-700">Tratamiento:</h4>
                                {historia.tratamientos.map((tratamiento) => (
                                    <div key={tratamiento.idTratamiento} className="bg-gray-100 p-3 rounded-lg mt-2">
                                        <p><strong>Médico:</strong> {tratamiento.medico.nombreUsuario}</p>
                                        <p><strong>Indicaciones:</strong> {tratamiento.indicaciones}</p>
                                        <p><strong>Fecha Inicio:</strong> {tratamiento.fechaInicio}</p>
                                        <p><strong>Fecha Fin:</strong> {tratamiento.fechaFin}</p>

                                        <h5 className="font-semibold mt-2">Medicamentos:</h5>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {tratamiento.medicamentos.map(med => (
                                                <li key={med.idMedicamento}>{med.nombre} - {med.dosisRecomendada}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

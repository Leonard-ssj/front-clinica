import api from "./api"; 

export const obtenerEstadisticas = async () => {
    try {
        const [usuarios, pacientes, citas, medicamentos] = await Promise.all([
            api.get("/estadisticas/total-usuarios"),
            api.get("/estadisticas/total-pacientes"),
            api.get("/estadisticas/total-citas-programadas"),
            api.get("/estadisticas/total-medicamentos"),
        ]);

        return {
            totalUsuarios: usuarios.data,
            totalPacientes: pacientes.data,
            totalCitas: citas.data,
            totalMedicamentos: medicamentos.data,
        };
    } catch (error) {
        console.error("Error obteniendo estadísticas", error);
        return {
            totalUsuarios: 0,
            totalPacientes: 0,
            totalCitas: 0,
            totalMedicamentos: 0,
        };
    }
};

import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/ui/StatCard";
import { obtenerEstadisticas } from "../../services/estadisticasService";
import { UserGroupIcon, CalendarDaysIcon, ClipboardDocumentIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";

export default function DashboardAdminPage() {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalPacientes: 0,
        totalCitas: 0,
        totalMedicamentos: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            const data = await obtenerEstadisticas();
            setStats(data);
        }
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-14 my-10">
                <h1 className="text-4xl font-bold mb-6 text-black">Dashboard del Administrador</h1>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Usuarios" value={stats.totalUsuarios} icon={<UserGroupIcon className="w-10 h-10" />} />
                <StatCard title="Total Pacientes" value={stats.totalPacientes} icon={<ClipboardDocumentIcon className="w-10 h-10" />} />
                <StatCard title="Citas Confirmadas" value={stats.totalCitas} icon={<CalendarDaysIcon className="w-10 h-10" />} />
                <StatCard title="Medicamentos en Stock" value={stats.totalMedicamentos} icon={<ArchiveBoxIcon className="w-10 h-10" />} />
            </div>
        </AdminLayout>
    );
}

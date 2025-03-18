import MedicoLayout from "../../components/layout/MedicoLayout";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { ClipboardDocumentListIcon, CalendarDaysIcon, UsersIcon } from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardMedicoPage() {
  // Datos para las tarjetas estáticas
  const stats = [
    { title: "Citas Programadas", value: 5, icon: <CalendarDaysIcon className="w-10 h-10 text-blue-600" /> },
    { title: "Pacientes Atendidos", value: 15, icon: <UsersIcon className="w-10 h-10 text-blue-600" /> },
    { title: "Historias Clínicas Registradas", value: 45, icon: <ClipboardDocumentListIcon className="w-10 h-10 text-blue-600" /> },
  ];

  // Datos para el gráfico de distribución de consultas
  const pieData = {
    labels: ["Consultas Generales", "Especialistas"],
    datasets: [
      {
        label: "Distribución",
        data: [60, 40],
        backgroundColor: ["#3B82F6", "#34D399"],
      },
    ],
  };

  // Datos para el gráfico de pacientes atendidos por semana
  const barData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Pacientes Atendidos",
        data: [4, 6, 8, 5, 7, 3, 2],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  return (
    <MedicoLayout>
      <div className="flex justify-between items-center mb-14 my-10">
        <h1 className="text-4xl font-bold mb-6 text-black">Dashboard del Médico</h1>
      </div>

      {/* Tarjetas Informativas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center p-6 bg-white shadow-md rounded-lg">
            <div className="mr-4">{stat.icon}</div>
            <div>
              <p className="text-3xl font-bold text-black">{stat.value}</p>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 my-10">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Distribución de Consultas</h2>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Pacientes Atendidos por Semana</h2>
          <Bar data={barData} />
        </div>
      </div>
    </MedicoLayout>
  );
}

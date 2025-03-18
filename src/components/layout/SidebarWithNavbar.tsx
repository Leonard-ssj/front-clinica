import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeIcon, UsersIcon, CalendarIcon, ClipboardDocumentListIcon, Bars3Icon } from "@heroicons/react/24/outline";

interface SidebarProps {
    role: "admin" | "medico" | "enfermera";
}

interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactElement;
}

export default function SidebarWithNavbar({ role }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Abierto en escritorio, cerrado en móvil

    // Manejar cambios de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(true); // Abierto en pantallas grandes
            } else {
                setIsOpen(false); // Cerrado en pantallas pequeñas
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    let menuItems: MenuItem[] = [];

    if (role === "admin") {
        menuItems = [
            { name: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
            { name: "Usuarios", path: "/admin/usuarios", icon: <UsersIcon className="w-5 h-5" /> },
            { name: "Pacientes", path: "/admin/pacientes", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
            { name: "Medicamentos", path: "/admin/medicamentos", icon: <CalendarIcon className="w-5 h-5" /> },
        ];
    } else if (role === "medico") {
        menuItems = [
            { name: "Dashboard", path: "/medico/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
            { name: "Pacientes", path: "/medico/pacientes", icon: <UsersIcon className="w-5 h-5" /> },
            { name: "Historias Clínicas", path: "/medico/historias-clinicas", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
            { name: "Citas", path: "/medico/citas", icon: <CalendarIcon className="w-5 h-5" /> },
        ];
    } else if (role === "enfermera") {
        menuItems = [
            { name: "Dashboard", path: "/enfermera/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
            { name: "Pacientes", path: "/enfermera/pacientes", icon: <UsersIcon className="w-5 h-5" /> },
            { name: "Citas", path: "/enfermera/citas", icon: <CalendarIcon className="w-5 h-5" /> },
        ];
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full bg-blue-600 text-white p-4 flex items-center space-x-4 border-b-4 border-b-blue-800">
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-blue-700 lg:hidden">
                    <Bars3Icon className="w-6 h-6" />
                </button>
                <span className="text-3xl font-semibold">Gestión Clínica</span>
            </nav>

            {/* Sidebar */}
            <aside className={`text-lg border-r-4 border-r-blue-800 fixed top-0 left-0 z-40 w-64 h-screen pt-16 bg-blue-600 text-white transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto mt-6">
                    <ul className="space-y-3 font-medium">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link to={item.path} className="flex items-center p-2 rounded-lg hover:bg-blue-700">
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}

import SidebarWithNavbar from "./SidebarWithNavbar";
import Footer from "./Footer"; // Importar el footer
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function MedicoLayout({ children }: LayoutProps) {
    console.log("MedicoLayout está renderizando sus children", children);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <SidebarWithNavbar role="medico" />
            <div className="flex flex-col flex-1 lg:ml-64 p-6 pt-20">
                <main className="flex-1">{children}</main>
                <Footer /> {/* Agregar el Footer aquí */}
            </div>
        </div>
    );
}

import { Routes, Route } from "react-router-dom";

// Importar páginas del Administrador
import {
  DashboardAdminPage,
  GestionUsuariosPage,
  GestionPacientesPage as GestionPacientesAdminPage,
  GestionMedicamentosPage,
} from "../pages/administrador";

// Importar páginas del Médico
import {
  DashboardMedicoPage,
  GestionPacientesPage as GestionPacientesMedicoPage,
  GestionHistoriasClinicasPage,
  AsignacionTratamientosPage,
  GestionCitasPage as GestionCitasMedicoPage,
} from "../pages/medico";

// Importar páginas de la Enfermera
import {
  DashboardEnfermeraPage,
  GestionPacientesPage as GestionPacientesEnfermeraPage,
  GestionCitasPage as GestionCitasEnfermeraPage,
} from "../pages/enfermera";

// Importar página de error 404
import { NotFoundPage } from "../pages/notfound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas del Administrador */}
      <Route path="/admin/dashboard" element={<DashboardAdminPage />} />
      <Route path="/admin/usuarios" element={<GestionUsuariosPage />} />
      <Route path="/admin/pacientes" element={<GestionPacientesAdminPage />} />
      <Route path="/admin/medicamentos" element={<GestionMedicamentosPage />} />

      {/* Rutas del Médico */}
      <Route path="/medico/dashboard" element={<DashboardMedicoPage />} />
      <Route path="/medico/pacientes" element={<GestionPacientesMedicoPage />} />
      <Route path="/medico/historias-clinicas" element={<GestionHistoriasClinicasPage />} />
      <Route path="/medico/tratamientos" element={<AsignacionTratamientosPage />} />
      <Route path="/medico/citas" element={<GestionCitasMedicoPage />} />

      {/* Rutas de la Enfermera */}
      <Route path="/enfermera/dashboard" element={<DashboardEnfermeraPage />} />
      <Route path="/enfermera/pacientes" element={<GestionPacientesEnfermeraPage />} />
      <Route path="/enfermera/citas" element={<GestionCitasEnfermeraPage />} />

      {/* Página de error 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

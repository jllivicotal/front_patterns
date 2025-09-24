import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VehiculosPage } from '@/pages/VehiculosPage';
import { NuevoVehiculoPage } from '@/pages/NuevoVehiculoPage';
import { VehiculoEditPage } from '@/pages/VehiculoEditPage';
import { VehiculoDetailPage } from '@/pages/VehiculoDetailPage';
import { ActivosPage } from '@/pages/ActivosPage';
import { NuevoActivoPage } from '@/pages/NuevoActivoPage';
import { ActivoEditPage } from '@/pages/ActivoEditPage';
import { ActivoDetailPage } from '@/pages/ActivoDetailPage';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Rutas de Vehículos */}
          <Route path="/vehiculos" element={<VehiculosPage />} />
          <Route path="/vehiculos/nuevo" element={<NuevoVehiculoPage />} />
          <Route path="/vehiculos/:codigo" element={<VehiculoDetailPage />} />
          <Route path="/vehiculos/:codigo/editar" element={<VehiculoEditPage />} />
          
          {/* Rutas de Activos */}
          <Route path="/activos" element={<ActivosPage />} />
          <Route path="/activos/nuevo" element={<NuevoActivoPage />} />
          <Route path="/activos/:codigo" element={<ActivoDetailPage />} />
          <Route path="/activos/:codigo/editar" element={<ActivoEditPage />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<div className="text-center py-8"><h1 className="text-2xl font-bold">Página no encontrada</h1></div>} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;

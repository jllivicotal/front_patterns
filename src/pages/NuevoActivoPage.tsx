import { useNavigate } from 'react-router-dom';
import { ActivoForm } from '@/components/ActivoForm';
import { useActivos } from '@/hooks/useActivos';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { CrearActivoDto } from '@/types';

export function NuevoActivoPage() {
  const navigate = useNavigate();
  const { createActivo, loading } = useActivos();

  const handleSubmit = async (data: CrearActivoDto) => {
    try {
      await createActivo(data);
      navigate('/activos');
    } catch (error) {
      // El error se maneja en el hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/activos')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Activo Fijo</h1>
          <p className="text-gray-600 mt-2">
            Crea un nuevo activo fijo utilizando el patrón Factory
          </p>
        </div>
      </div>

      <ActivoForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
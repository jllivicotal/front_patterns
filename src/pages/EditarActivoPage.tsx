import { useParams, useNavigate } from 'react-router-dom';
import { ActivoForm } from '@/components/ActivoForm';
import { useActivo, useActivos } from '@/hooks/useActivos';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { CrearActivoDto } from '@/types';

export function EditarActivoPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { updateActivo, loading: updateLoading } = useActivos();
  const { activo, loading: activoLoading } = useActivo(codigo ? parseInt(codigo) : null);

  const handleSubmit = async (data: CrearActivoDto) => {
    if (!codigo) return;
    
    try {
      await updateActivo(parseInt(codigo), data);
      navigate('/activos');
    } catch (error) {
      // El error se maneja en el hook
    }
  };

  if (activoLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/activos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Activo Fijo</h1>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando activo...</p>
        </div>
      </div>
    );
  }

  if (!activo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/activos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activo no encontrado</h1>
          </div>
        </div>
        <p className="text-gray-600">El activo solicitado no existe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/activos')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Activo Fijo</h1>
          <p className="text-gray-600 mt-2">
            Modifica los datos del activo "{activo.nombre}"
          </p>
        </div>
      </div>

      <ActivoForm
        onSubmit={handleSubmit}
        initialData={activo}
        isEdit={true}
        loading={updateLoading}
      />
    </div>
  );
}
import { useParams, useNavigate } from 'react-router-dom';
import { VehiculoForm } from '@/components/VehiculoForm';
import { useVehiculo, useVehiculos } from '@/hooks/useVehiculos';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { CrearVehiculoDto } from '@/types';

export function EditarVehiculoPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { updateVehiculo, loading: updateLoading } = useVehiculos();
  const { vehiculo, loading: vehiculoLoading } = useVehiculo(codigo ? parseInt(codigo) : null);

  const handleSubmit = async (data: CrearVehiculoDto) => {
    if (!codigo) return;
    
    try {
      await updateVehiculo(parseInt(codigo), data);
      navigate('/vehiculos');
    } catch (error) {
      // El error se maneja en el hook
    }
  };

  if (vehiculoLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/vehiculos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Vehículo</h1>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/vehiculos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehículo no encontrado</h1>
          </div>
        </div>
        <p className="text-gray-600">El vehículo solicitado no existe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/vehiculos')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Vehículo</h1>
          <p className="text-gray-600 mt-2">
            Modifica los datos del vehículo "{vehiculo.nombre}"
          </p>
        </div>
      </div>

      <VehiculoForm
        onSubmit={handleSubmit}
        initialData={vehiculo}
        isEdit={true}
        loading={updateLoading}
      />
    </div>
  );
}
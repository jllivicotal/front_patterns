import { useNavigate } from 'react-router-dom';
import { VehiculoForm } from '@/components/VehiculoForm';
import { useVehiculos } from '@/hooks/useVehiculos';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { CrearVehiculoDto } from '@/types';

export function NuevoVehiculoPage() {
  const navigate = useNavigate();
  const { createVehiculo, loading } = useVehiculos();

  const handleSubmit = async (data: CrearVehiculoDto) => {
    try {
      await createVehiculo(data);
      toast.success('🎉 ¡Vehículo creado exitosamente!', {
        description: `El ${data.tipo.toLowerCase()} "${data.nombre}" ha sido registrado correctamente.`,
        duration: 5000,
      });
      navigate('/vehiculos');
    } catch (error) {
      toast.error('❌ Error al crear vehículo', {
        description: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado. Inténtalo de nuevo.',
        duration: 6000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/vehiculos')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Vehículo</h1>
          <p className="text-gray-600 mt-2">
            Crea un nuevo vehículo utilizando el patrón Builder
          </p>
        </div>
      </div>

      <VehiculoForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
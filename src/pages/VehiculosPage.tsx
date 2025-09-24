import VehiculoList from '@/components/VehiculoList';
import { useVehiculos } from '@/hooks/useVehiculos';

export function VehiculosPage() {
  const { vehiculos, loading, error, deleteVehiculo } = useVehiculos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
        <p className="text-gray-600 mt-2">
          Gestión de vehículos utilizando el patrón Builder para construcción paso a paso
        </p>
      </div>

      <VehiculoList
        vehiculos={vehiculos}
        loading={loading}
        error={error}
        onDelete={deleteVehiculo}
      />
    </div>
  );
}
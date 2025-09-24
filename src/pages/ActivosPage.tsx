import { ActivoList } from '../components/ActivoList';
import { useActivos } from '@/hooks/useActivos';

export function ActivosPage() {
  const { activos, loading, error, deleteActivo } = useActivos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activos Fijos</h1>
        <p className="text-gray-600 mt-2">
          Gestión de activos fijos utilizando el patrón Factory para creación centralizada
        </p>
      </div>

      <ActivoList
        activos={activos}
        loading={loading}
        error={error}
        onDelete={deleteActivo}
      />
    </div>
  );
}
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  Package,
  Code2,
  Factory,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Star,
  FolderTree,
  Layers,
  Files,
  ThermometerSun,
} from 'lucide-react';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useActivos } from '@/hooks/useActivos';

export function HomePage() {
  // Los datos se cargan automáticamente en los hooks
  useVehiculos();
  useActivos();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Gestión
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            con Patrones de Diseño
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Implementación completa de los patrones <span className="font-semibold text-blue-600">Builder</span>,{' '}
            <span className="font-semibold text-purple-600">Factory</span>,{' '}
            <span className="font-semibold text-amber-600">Composite</span> y{' '}
            <span className="font-semibold text-sky-600">Adapter</span> usando NestJS, Prisma, SQLite y React con TypeScript.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Tiempo Real
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Type Safe
            </Badge>
          </div>
        </div>

        {/* Pattern Cards */}
  <div className="grid gap-8 max-w-6xl mx-auto md:grid-cols-2 xl:grid-cols-4">
          {/* Builder Pattern Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-blue-100 hover:border-blue-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Vehículos</CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                      <Code2 className="w-4 h-4 mr-1" />
                      Builder Pattern
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="px-6 text-gray-600 text-base leading-relaxed">
              Sistema de construcción paso a paso de vehículos con diferentes tipos y características específicas.
            </CardDescription>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Tipos soportados:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">Auto</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">Camioneta</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">Camión</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Características:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Construcción fluida con VehiculoBuilder
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cálculo automático de costo de matrícula
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Relación con propietarios
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/vehiculos" className="flex items-center justify-center">
                  Gestionar Vehículos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Factory Pattern Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-bl-full opacity-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Activos Fijos</CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-200">
                      <Factory className="w-4 h-4 mr-1" />
                      Factory Pattern
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="px-6 text-gray-600 text-base leading-relaxed">
              Sistema de fabricación de diferentes tipos de activos fijos con características específicas.
            </CardDescription>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Tipos soportados:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Computador</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Mesa</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Silla</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Auto</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Otro</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Características:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Creación automática mediante Factory
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Campos dinámicos según tipo de activo
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Gestión de depreciación automática
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/activos" className="flex items-center justify-center">
                  Gestionar Activos Fijos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Composite Pattern Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <FolderTree className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Sistema de Archivos</CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-amber-100 text-amber-700 hover:bg-amber-200">
                      <Layers className="w-4 h-4 mr-1" />
                      Composite Pattern
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="px-6 text-gray-600 text-base leading-relaxed">
              Jerarquía de carpetas y archivos (PDF, DOCX, XLSX) con cálculo automático del tamaño agregado.
            </CardDescription>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Características destacadas:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                    <Files className="w-4 h-4 text-amber-500 mr-2" />
                    Visualización jerárquica con expansión recursiva
                  </div>
                  <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Estadísticas agregadas (tamaño, carpetas, archivos)
                  </div>
                  <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Árbol sincronizado con NestJS + Composite Pattern
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/filesystem" className="flex items-center justify-center">
                  Explorar Sistema de Archivos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Adapter Pattern Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-sky-100 hover:border-sky-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg">
                    <ThermometerSun className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Sistema de Temperatura</CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-sky-100 text-sky-700 hover:bg-sky-200">
                      <ThermometerSun className="w-4 h-4 mr-1" />
                      Adapter Pattern
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="px-6 text-gray-600 text-base leading-relaxed">
              Integración de sensores en °C y °F unificados mediante un Adapter que normaliza todas las lecturas a grados Celsius.
            </CardDescription>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Características:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center bg-sky-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-sky-500 mr-2" />
                    Conversión automática de °F a °C
                  </div>
                  <div className="flex items-center bg-sky-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-sky-500 mr-2" />
                    Sincronización con bloques persistidos en Prisma
                  </div>
                  <div className="flex items-center bg-sky-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-sky-500 mr-2" />
                    Registro manual de lecturas
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/temperaturas" className="flex items-center justify-center">
                  Gestionar temperatura
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Stack Tecnológico
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Tecnologías de vanguardia utilizadas en este proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="font-bold text-lg text-blue-800">Frontend</div>
                <div className="text-sm text-blue-600 space-y-1">
                  <div>React 19</div>
                  <div>TypeScript</div>
                  <div>Tailwind CSS</div>
                  <div>shadcn/ui</div>
                </div>
              </div>
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="font-bold text-lg text-green-800">Backend</div>
                <div className="text-sm text-green-600 space-y-1">
                  <div>NestJS</div>
                  <div>TypeScript</div>
                  <div>Prisma ORM</div>
                  <div>Axios</div>
                </div>
              </div>
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                <div className="font-bold text-lg text-yellow-800">Base de Datos</div>
                <div className="text-sm text-yellow-600 space-y-1">
                  <div>SQLite</div>
                  <div>Migraciones</div>
                  <div>Prisma Client</div>
                  <div>Type Safety</div>
                </div>
              </div>
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="font-bold text-lg text-purple-800">Patrones</div>
                <div className="text-sm text-purple-600 space-y-1">
                  <div>Builder</div>
                  <div>Factory</div>
                  <div>Composite</div>
                  <div>Adapter</div>
                  <div>Repository</div>
                  <div>SOLID</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Star,
  FileText,
  Terminal,
  History,
  Undo2,
  Redo2,
} from 'lucide-react';

export function HomePage() {
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
            Implementación completa de los patrones{' '}
            <span className="font-semibold text-purple-600">Memento</span> y{' '}
            <span className="font-semibold text-green-600">Command</span>{' '}
            usando NestJS, Prisma, SQLite y React con TypeScript.
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
        <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-2">
          {/* Memento Pattern Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Sistema de Certificados</CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-200">
                      <History className="w-4 h-4 mr-1" />
                      Memento Pattern
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="px-6 text-gray-600 text-base leading-relaxed">
              Sistema de gestión de solicitudes de certificados con capacidad completa de Undo/Redo y snapshots de estado.
            </CardDescription>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Funcionalidades:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center bg-purple-50 p-2 rounded-lg">
                    <Undo2 className="w-4 h-4 text-purple-500 mr-2" />
                    Undo/Redo ilimitado de todas las operaciones
                  </div>
                  <div className="flex items-center bg-purple-50 p-2 rounded-lg">
                    <History className="w-4 h-4 text-purple-500 mr-2" />
                    Visualización completa del historial de cambios
                  </div>
                  <div className="flex items-center bg-purple-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Gestión de adjuntos y generación de certificados
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Estados del certificado:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Borrador</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Generado</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">Firmado</Badge>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/memento" className="flex items-center justify-center">
                  Gestionar Certificados
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Command Pattern Card */}
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 border-green-100 hover:border-green-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                    <Terminal className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Editor de Texto</CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 hover:bg-green-200">
                      <Terminal className="w-4 h-4 mr-1" />
                      Command Pattern
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="px-6 text-gray-600 text-base leading-relaxed">
              Editor de texto con comandos desacoplados, Undo/Redo ilimitado y soporte para grabación y ejecución de macros.
            </CardDescription>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Comandos disponibles:
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Insertar, borrar y reemplazar texto
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <Undo2 className="w-4 h-4 text-green-500 mr-2" />
                    Undo/Redo de todas las operaciones
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded-lg">
                    <Redo2 className="w-4 h-4 text-green-500 mr-2" />
                    Grabación y ejecución de macros (Composite)
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Características avanzadas:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Macros</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Log de operaciones</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Historial</Badge>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/command" className="flex items-center justify-center">
                  Abrir Editor
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
                  <div>Memento</div>
                  <div>Command</div>
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
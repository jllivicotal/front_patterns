import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Sparkles, FolderTree, ThermometerSun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg animate-float">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Design Patterns
                  </h1>
                  <p className="text-xs text-gray-500">Sistema de Gestión</p>
                </div>
              </div>
              <div className="hidden md:flex space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover-lift">
                  React + NestJS
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover-lift">
                  TypeScript
                </Badge>
              </div>
            </div>
            
            <nav className="flex items-center space-x-2">
              <Button
                asChild
                variant={isActive('/') && location.pathname === '/' ? 'default' : 'ghost'}
                size="sm"
                className={`hover-lift transition-all duration-300 ${
                  isActive('/') && location.pathname === '/' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg animate-glow' 
                    : 'hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Link to="/" className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Link>
              </Button>

              <Button
                asChild
                variant={isActive('/filesystem') ? 'default' : 'ghost'}
                size="sm"
                className={`hover-lift transition-all duration-300 ${
                  isActive('/filesystem')
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg animate-glow'
                    : 'hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <Link to="/filesystem" className="flex items-center">
                  <FolderTree className="w-4 h-4 mr-2" />
                  Sistema de Archivos
                  <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Composite
                  </Badge>
                </Link>
              </Button>

              <Button
                asChild
                variant={isActive('/temperaturas') ? 'default' : 'ghost'}
                size="sm"
                className={`hover-lift transition-all duration-300 ${
                  isActive('/temperaturas')
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg animate-glow'
                    : 'hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <Link to="/temperaturas" className="flex items-center">
                  <ThermometerSun className="w-4 h-4 mr-2" />
                  Sistema de Temperatura
                  <Badge variant="outline" className="ml-2 text-xs bg-sky-50 text-sky-700 border-sky-200">
                    Adapter
                  </Badge>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/20 mt-16 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2025 Design Patterns System. Implementación con React + NestJS + TypeScript.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <Badge variant="outline" className="hover-lift">Builder Pattern</Badge>
              <Badge variant="outline" className="hover-lift">Factory Pattern</Badge>
              <Badge variant="outline" className="hover-lift">Adapter Pattern</Badge>
              <Badge variant="outline" className="hover-lift">Prisma ORM</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
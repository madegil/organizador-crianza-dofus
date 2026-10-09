import React from 'react';
import { Home, Calculator, BookOpen, GitFork } from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/' }) => {
  const navItems = [
    { href: '/', label: 'Establo', icon: Home },
    { href: '/calculadora', label: 'Calculadora', icon: Calculator },
    { href: '/coleccion', label: 'Colección', icon: BookOpen },
    { href: '/cruces', label: 'Cruces', icon: GitFork },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto pt-4 pb-2 px-3 sm:px-6">
      {/* Banner decorativo oficial 'Gestor de monturas' (Presente en todas las secciones) */}
      <div className="flex flex-col items-center justify-center select-none">
        <a href="/" className="relative inline-flex flex-col items-center group cursor-pointer hover:scale-[1.01] transition-transform">
          <img
            src="/Logo_gestor_montura.png"
            alt="Gestor de monturas"
            width={320}
            height={112}
            className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-md"
          />
        </a>
      </div>

      {/* Menú centrado por debajo del banner decorativo (Versión PC / Desktop) */}
      <nav className="hidden md:flex items-center justify-center mt-4 mb-2 select-none">
        <div className="bg-[#172554]/90 backdrop-blur-md border border-blue-900/60 p-1.5 rounded-2xl shadow-xl flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md border border-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Menú inferior persistente (Versión Móvil) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#172554]/95 backdrop-blur-lg border-t border-blue-900/60 px-2 py-1.5 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-extrabold transition-all ${
                  isActive
                    ? 'bg-blue-600/80 text-white shadow-sm border border-blue-400/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

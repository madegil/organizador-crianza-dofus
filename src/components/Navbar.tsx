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
    <>
      {/* Barra de navegación superior (Desktop y Móvil) */}
      <header className="bg-[#12151c]/95 backdrop-blur-md border-b border-dofus-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo y Nombre */}
            <a href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <span className="text-base sm:text-lg">🐴</span>
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-wide truncate block">
                  Gestor de monturas
                </span>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                  Crianza & XP Dofus 3.5
                </p>
              </div>
            </a>

            {/* Enlaces de escritorio */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#1e3a8a] text-white shadow-sm border border-blue-600/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Menú inferior persistente - Móvil (Fiel al diseño de la referencia) */}
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
    </>
  );
};

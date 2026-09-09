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
          {/* Hojas decorativas superiores */}
          <span className="absolute -top-3 left-6 text-emerald-500 text-2xl filter drop-shadow">🍃</span>
          <span className="absolute -top-3 right-6 text-emerald-500 text-2xl transform scale-x-[-1] filter drop-shadow">🍃</span>

          {/* Sello de herradura central */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-amber-950 flex items-center justify-center shadow-md -mb-3.5 z-10">
            <span className="text-amber-950 text-base font-black">🐴</span>
          </div>

          {/* Tablón de madera texturizado */}
          <div className="bg-gradient-to-b from-[#5c3a21] via-[#432818] to-[#2e180d] border-[3.5px] border-[#241208] rounded-2xl px-8 sm:px-12 py-3 shadow-2xl shadow-black/70 relative min-w-[260px] sm:min-w-[320px]">
            {/* Clavos esquineros */}
            <div className="absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>
            <div className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>
            <div className="absolute bottom-2 left-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>
            <div className="absolute bottom-2 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-700/80 border border-black/60 shadow-inner"></div>

            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
                Gestor de
              </span>
              <span className="block text-3xl sm:text-4xl font-black text-[#facc15] tracking-wide drop-shadow-[0_3px_5px_rgba(0,0,0,1)] leading-none mt-0.5">
                monturas
              </span>
            </div>
          </div>
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

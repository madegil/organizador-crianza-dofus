import React from 'react';
import { Sparkles, Calculator, Layers, GitFork, Home } from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/' }) => {
  const navItems = [
    { href: '/', label: 'Inventario & Establo', icon: Home },
    { href: '/calculadora', label: 'Calculadora XP & Carburantes', icon: Calculator },
    { href: '/coleccion', label: 'Colección & Progreso 200', icon: Layers },
    { href: '/cruces', label: 'Árbol de Cruces', icon: GitFork },
  ];

  return (
    <header className="bg-dofus-card/90 backdrop-blur-md border-b border-dofus-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-wide flex items-center gap-2">
                Dofus 3.5 <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">Criador</span>
              </span>
              <p className="text-xs text-slate-400">Organizador de Crianza & XP</p>
            </div>
          </a>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

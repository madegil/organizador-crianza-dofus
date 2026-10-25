import React from 'react';
import { IconGuia, IconEstablo, IconCalculadora, IconColeccion, IconCruces } from './DofusIcons';

interface NavbarProps {
  currentPath?: string;
}

const navItems = [
  { href: '/', label: 'Guía', icon: IconGuia },
  { href: '/establo', label: 'Establo', icon: IconEstablo },
  { href: '/calculadora', label: 'Calculadora', icon: IconCalculadora },
  { href: '/coleccion', label: 'Colección', icon: IconColeccion },
  { href: '/cruces', label: 'Cruces', icon: IconCruces },
];

const isActivePath = (currentPath: string, href: string) =>
  currentPath === href || (href !== '/' && currentPath.startsWith(href));

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/' }) => {
  return (
    <div className="w-full max-w-7xl mx-auto pt-4 pb-2 px-3 sm:px-6">
      {/* Rótulo del sitio: "eclosiona" una sola vez al cargar */}
      <div className="flex flex-col items-center justify-center select-none">
        <a
          href="/"
          aria-label="Gestor de monturas, ir a la Guía"
          className="logo-eclosion relative inline-flex flex-col items-center rounded-2xl hover:-rotate-1 hover:scale-[1.03] ease-rebote duration-500"
        >
          <img
            src="/Logo_gestor_montura.svg"
            alt=""
            width={320}
            height={112}
            className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]"
          />
        </a>
      </div>

      {/* Escritorio: el menú es el travesaño de un cercado, con un clavo en cada extremo */}
      <nav aria-label="Navegación principal" className="hidden md:flex justify-center mt-4 mb-3 select-none cercado-entrada">
        <div className="tablon relative flex items-center gap-1 rounded-2xl px-4 py-2 border border-madera-oscuro">
          <span className="clavo absolute left-2 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <span className="clavo absolute right-2 top-1/2 -translate-y-1/2" aria-hidden="true" />
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(currentPath, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-item group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                  isActive
                    ? 'bg-[#25180c] text-kama shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
                    : 'text-[#f3e7c9] hover:text-white hover:bg-[#4a321d] hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`ficha grid place-items-center w-8 h-8 -my-1 rounded-full border-2 ${
                    isActive
                      ? 'bg-[#fbf4e1] border-kama shadow-[0_0_0_3px_rgba(242,193,78,0.25)]'
                      : 'bg-[#e9dbb8] border-[#25180c] group-hover:bg-[#fbf4e1]'
                  }`}
                >
                  <Icon className="nav-icono w-6 h-6" />
                </span>
                <span>{item.label}</span>
                {/* Sello dorado bajo la sección actual */}
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 -bottom-1 h-1 rounded-full bg-kama -translate-x-1/2 duration-500 ease-resorte ${
                    isActive ? 'w-8 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-60'
                  }`}
                />
              </a>
            );
          })}
        </div>
      </nav>

      {/* Móvil: barra inferior persistente de madera */}
      <nav
        aria-label="Navegación principal"
        className="md:hidden tablon fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#6b4a2b] px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(currentPath, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-item flex flex-col items-center justify-center min-h-[56px] py-1 px-0.5 rounded-xl text-[10px] min-[360px]:text-[11px] font-bold active:scale-95 ${
                  isActive
                    ? 'bg-[#25180c] text-kama shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
                    : 'text-[#f3e7c9]'
                }`}
              >
                <span
                  className={`ficha grid place-items-center w-8 h-8 mb-0.5 rounded-full border-2 ${
                    isActive
                      ? 'bg-[#fbf4e1] border-kama -translate-y-0.5 shadow-[0_0_0_3px_rgba(242,193,78,0.25)]'
                      : 'bg-[#e9dbb8] border-[#25180c]'
                  }`}
                >
                  <Icon className="nav-icono w-6 h-6" />
                </span>
                <span className="truncate max-w-full">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

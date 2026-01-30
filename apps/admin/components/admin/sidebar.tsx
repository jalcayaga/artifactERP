import React from "react";
import Link from "next/link";

interface SidebarProps {
  // Add any props if needed, e.g., currentPath
}

const Sidebar: React.FC<SidebarProps> = () => {
  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Empresas", href: "/companies" },
    { name: "Ventas", href: "/sales" },
    { name: "Compras", href: "/purchases" },
    { name: "Facturación", href: "/invoices" },
    { name: "Suscripciones", href: "/subscriptions" },
    { name: "Inventario", href: "/inventory" },
    { name: "Usuarios", href: "/users" },
    { name: "Roles", href: "/roles" },
    { name: "Integraciones", href: "/integrations" },
    { name: "Branding", href: "/branding" },
    // Add more admin navigation links here
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-6">
      <div className="text-2xl font-bold mb-6">Admin Panel</div>
      <nav>
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

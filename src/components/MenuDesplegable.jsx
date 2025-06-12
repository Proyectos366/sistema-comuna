"use client";

import { useState } from "react";

export default function MenuDesplegable({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-md shadow-md w-full ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 color-fondo text-white font-semibold rounded-md flex justify-between items-center"
      >
        <span>Menú de opciones</span>
        <span>{isOpen ? "▲" : "▼"}</span> {/* Ícono cambia según estado */}
      </button>

      {isOpen && (
        <div className="p-4 bg-white rounded-b-lg transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

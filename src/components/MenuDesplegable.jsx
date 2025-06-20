"use client";

import { useState } from "react";

export default function MenuDesplegable({ children, titulo }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-md shadow-md w-full mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 color-fondo text-white font-semibold rounded-md flex justify-between items-center cursor-pointer"
      >
        <span>{!titulo ? "Menú de opciones" : titulo}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="flex flex-col space-y-2 p-4 bg-white rounded-b-lg transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

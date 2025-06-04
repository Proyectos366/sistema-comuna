"use client";

import { useEffect } from "react";

const MarcaAgua = () => {
  useEffect(() => {
    const marcaAgua = document.createElement("div");
    marcaAgua.innerText = "Contenido protegido";
    marcaAgua.style.position = "fixed";
    marcaAgua.style.top = "57%";
    marcaAgua.style.left = "60%";
    marcaAgua.style.transform = "translate(-50%, -50%)";
    marcaAgua.style.background = "rgba(0, 0, 0, 0.5)";
    marcaAgua.style.color = "white";
    marcaAgua.style.fontSize = "24px";
    marcaAgua.style.padding = "10px";
    marcaAgua.style.borderRadius = "5px";
    marcaAgua.style.zIndex = "9999";
    document.body.appendChild(marcaAgua);

    return () => {
      document.body.removeChild(marcaAgua); // Elimina la marca al desmontar el componente
    };
  }, []);

  return null; // No renderiza nada en la interfaz
};

export default MarcaAgua;

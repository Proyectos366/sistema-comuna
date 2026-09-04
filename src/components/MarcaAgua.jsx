"use client";

import { useEffect } from "react";

const MarcaAgua = ({
  texto = "Contenido protegido",
  opacidad = 0.06,
  tamano = 80,
  color = "#000000",
  rotacion = -25,
  anchoCanvas = 600,
  altoCanvas = 300,
  escalaRepeticion = 0.3, // NUEVO: controla qué tan pequeña es cada repetición (0.1-1)
}) => {
  useEffect(() => {
    // 1. CREAR MARCA DE AGUA CON CANVAS
    const crearMarcaAgua = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = anchoCanvas;
      canvas.height = altoCanvas;

      ctx.translate(anchoCanvas / 2, altoCanvas / 2);
      ctx.rotate((rotacion * Math.PI) / 180);
      ctx.font = `${tamano}px Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacidad;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lineas = texto.split("\n");
      const lineHeight = tamano * 1.2;
      const totalHeight = lineas.length * lineHeight;

      lineas.forEach((linea, index) => {
        const y = -totalHeight / 2 + index * lineHeight + lineHeight / 2;
        ctx.fillText(linea.trim(), 0, y);
      });

      return canvas;
    };

    const container = document.createElement("div");
    const canvas = crearMarcaAgua();
    const dataUrl = canvas.toDataURL("image/png");

    // Calcular tamaño de repetición basado en el canvas y la escala
    const repeticionAncho = anchoCanvas * escalaRepeticion;
    const repeticionAlto = altoCanvas * escalaRepeticion;

    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background-image: url(${dataUrl});
      background-repeat: repeat;
      background-size: ${repeticionAncho}px ${repeticionAlto}px;
      background-position: center;
    `;

    document.body.appendChild(container);

    // 2. ESTILOS PARA BLOQUEAR SELECCIÓN
    const estiloGlobal = document.createElement("style");
    estiloGlobal.textContent = `
      .contenido-protegido {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
      .contenido-protegido * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
    `;
    document.head.appendChild(estiloGlobal);

    // 3. BLOQUEAR EVENTOS
    const bloquearSeleccionYCopia = (e) => {
      if (
        e.type === "selectstart" ||
        e.type === "mousedown" ||
        e.type === "mouseup"
      ) {
        e.preventDefault();
        return false;
      }
      if (e.type === "copy" || e.type === "cut" || e.type === "paste") {
        e.preventDefault();
        return false;
      }
      if (e.type === "contextmenu") {
        e.preventDefault();
        return false;
      }
    };

    const bloquearAtajos = (e) => {
      if (
        e.ctrlKey &&
        ["c", "x", "v", "a", "s", "p", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        return false;
      }
      if (e.key === "F12" || e.key === "PrintScreen") {
        e.preventDefault();
        return false;
      }
    };

    const bloquearArrastre = (e) => {
      if (e.target.tagName === "IMG" || e.target.tagName === "A") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("selectstart", bloquearSeleccionYCopia, true);
    document.addEventListener("copy", bloquearSeleccionYCopia, true);
    document.addEventListener("cut", bloquearSeleccionYCopia, true);
    document.addEventListener("paste", bloquearSeleccionYCopia, true);
    document.addEventListener("contextmenu", bloquearSeleccionYCopia, true);
    document.addEventListener("mousedown", bloquearSeleccionYCopia, true);
    document.addEventListener("mouseup", bloquearSeleccionYCopia, true);
    document.addEventListener("keydown", bloquearAtajos, true);
    document.addEventListener("dragstart", bloquearArrastre, true);

    // 4. LIMPIEZA
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
      if (estiloGlobal && document.head.contains(estiloGlobal)) {
        document.head.removeChild(estiloGlobal);
      }

      document.removeEventListener(
        "selectstart",
        bloquearSeleccionYCopia,
        true,
      );
      document.removeEventListener("copy", bloquearSeleccionYCopia, true);
      document.removeEventListener("cut", bloquearSeleccionYCopia, true);
      document.removeEventListener("paste", bloquearSeleccionYCopia, true);
      document.removeEventListener(
        "contextmenu",
        bloquearSeleccionYCopia,
        true,
      );
      document.removeEventListener("mousedown", bloquearSeleccionYCopia, true);
      document.removeEventListener("mouseup", bloquearSeleccionYCopia, true);
      document.removeEventListener("keydown", bloquearAtajos, true);
      document.removeEventListener("dragstart", bloquearArrastre, true);
    };
  }, [
    texto,
    opacidad,
    tamano,
    color,
    rotacion,
    anchoCanvas,
    altoCanvas,
    escalaRepeticion,
  ]);

  return null;
};

export default MarcaAgua;

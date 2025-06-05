"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function CrearManuales() {
  const router = useRouter();
  const crearRoles = async () => {
    try {
      const responseRol = await axios.get(`/api/crear-manuales/crear-rol`);

      if (responseRol?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear roles");
      }
    } catch (error) {
      console.log("Error, al crear roles: " + error);
    }
  };

  const crearParroquias = async () => {
    try {
      const responseParroquias = await axios.get(
        `/api/crear-manuales/crear-parroquias`
      );

      if (responseParroquias?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear parroquias");
      }
    } catch (error) {
      console.log("Error, al crear parroquias: " + error);
    }
  };

  const crearComunasVillaDeCura = async () => {
    try {
      const responseComunasVillaDeCura = await axios.get(
        `/api/crear-manuales/crear-comunas`
      );

      if (responseComunasVillaDeCura?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear comunas");
      }
    } catch (error) {
      console.log("Error, al crear comunas: " + error);
    }
  };

  const crearCargos = async () => {
    try {
      const responseCargos = await axios.get(`/api/crear-manuales/crear-cargo`);

      if (responseCargos?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear cargo");
      }
    } catch (error) {
      console.log("Error, al crear cargo: " + error);
    }
  };

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 container mx-auto">
      <header></header>
      <main className="border bg-white flex items-center justify-center">
        <section className="flex space-x-10">
          <div>
            <button
              className="cursor-pointer borde-fondo px-6 py-2 rounded-md bg-red-300 hover:bg-red-400 hover:px-8"
              onClick={() => crearRoles()}
            >
              Crear roles
            </button>
          </div>

          <div>
            <button
              className="cursor-pointer borde-fondo px-6 py-2 rounded-md bg-red-300 hover:bg-red-400 hover:px-8"
              onClick={() => crearParroquias()}
            >
              Crear parroquias
            </button>
          </div>

          <div>
            <button
              className="cursor-pointer borde-fondo px-6 py-2 rounded-md bg-red-300 hover:bg-red-400 hover:px-8"
              onClick={() => crearComunasVillaDeCura()}
            >
              Crear comunas
            </button>
          </div>

          <div>
            <button
              className="cursor-pointer borde-fondo px-6 py-2 rounded-md bg-red-300 hover:bg-red-400 hover:px-8"
              onClick={() => crearCargos()}
            >
              Crear cargo
            </button>
          </div>
        </section>
        <footer></footer>
      </main>
    </div>
  );
}

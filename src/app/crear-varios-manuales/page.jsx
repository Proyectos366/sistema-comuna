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

  const crearModulos = async () => {
    try {
      const responseModulos = await axios.get(
        `/api/crear-manuales/crear-modulos`
      );

      if (responseModulos?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear modulos");
      }
    } catch (error) {
      console.log("Error, al crear modulos: " + error);
    }
  };

  const crearFormaciones = async () => {
    try {
      const responseFormaciones = await axios.get(
        `/api/crear-manuales/crear-formaciones`
      );

      if (responseFormaciones?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear formaciones");
      }
    } catch (error) {
      console.log("Error, al crear formaciones: " + error);
    }
  };

   const crearDepartamentos = async () => {
    try {
      const responseDepartamentos = await axios.get(
        `/api/crear-manuales/crear-departamentos`
      );

      if (responseDepartamentos?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear departamentos");
      }
    } catch (error) {
      console.log("Error, al crear departamentos: " + error);
    }
  };

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 container mx-auto">
      <header></header>
      <main className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center p-10">
        <section className="grid grid-cols-3 gap-6">
          <BotonCreacionesManuales nombre={"Crear roles"} crear={crearRoles} />

          <BotonCreacionesManuales
            nombre={"Crear parroquias"}
            crear={crearParroquias}
          />

          <BotonCreacionesManuales
            nombre={"Crear comunas villa de cura"}
            crear={crearComunasVillaDeCura}
          />

          <BotonCreacionesManuales
            nombre={"Crear cargos"}
            crear={crearCargos}
          />

          <BotonCreacionesManuales
            nombre={"Crear modulos"}
            crear={crearModulos}
          />

          <BotonCreacionesManuales
            nombre={"Crear departamentos"}
            crear={crearDepartamentos}
          />

          {/* <BotonCreacionesManuales
            nombre={"Crear formaciones"}
            crear={crearFormaciones}
          /> */}
        </section>
      </main>
      <footer className="text-black mt-10">© 2025 - Tu Proyecto</footer>
    </div>
  );
}

function BotonCreacionesManuales({ nombre, crear }) {
  return (
    <div className="bg-white shadow-lg rounded-md p-6 flex justify-center items-center">
      <button
        className="cursor-pointer borde-fondo px-6 py-2 rounded-md bg-red-300 hover:bg-red-400 hover:px-8"
        onClick={() => crear()}
      >
        {nombre}
      </button>
    </div>
  );
}

import Titulos from "@/components/Titulos";

export default function ListadoParroquias({ nombreListado, parroquias }) {
  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <Titulos indice={2} titulo={nombreListado} />
      <div className="space-y-3">
        {parroquias.map((lista, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-md transition-all duration-700 ease-in-out 
                 hover:bg-gray-200 hover:border hover:border-gray-300 
                 hover:shadow-md hover:scale-101 flex flex-col"
          >
            <span className="rounded-md p-3">{lista.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}







/**
 
 "use client";
 
 import { useState, useEffect, useRef } from "react";
 import { useRouter, usePathname } from "next/navigation";
 import MenuLateralUsuario from "@/components/sistema/MenuLateralUsuarios";
 import HeaderUsuarios from "@/components/sistema/HeaderUsuarios";
 import Footer from "../Footer";
 import { useUser } from "@/app/context/AuthContext";
 import MostrarPerfilUsuario from "./MostrarPerfilUsuario";
 import MostrarCambiarClaveUsuario from "./MostrarCambiarClaveUsuario";
 import ParroquiasForm from "../opciones/ParroquiasForm";
 import CargosForm from "../opciones/CargosForm";
 import ComunasForm from "../opciones/ComunasForm";
 import CircuitoForm from "../opciones/CircuitosForm";
 import ConsejoForm from "../opciones/ConsejoForm";
 import VoceroForm from "../opciones/VoceroForm";
 
 export default function VistaUniversalUsuarios({ children }) {
   const {
     usuarioActivo,
     screenSize,
     mostrarModal,
     abrirModal,
     cerrarModal,
     mensaje,
     mostrarMensaje,
     abrirMensaje,
     limpiarCampos,
   } = useUser();
 
   const [vista, setVista] = useState("");
   const [cargandoVista, setCargandoVista] = useState(false); // Estado para suavizar la transición
   const [abrirPanel, setAbrirPanel] = useState(true);
 
   const refMenuPerfil = useRef(null);
   const router = useRouter();
   const pathname = usePathname();
   const userType = usuarioActivo?.id_rol;
 
   // Maneja el cambio de tamaño de pantalla
   useEffect(() => {
     if (screenSize?.width > 640) {
       setAbrirPanel(true);
     } else {
       setAbrirPanel(false);
     }
   }, [screenSize]);
 
   // Maneja el cambio de rutas y evita pantallazos
   useEffect(() => {
     const subRuta = pathname.split("/").pop();
 
     if (!subRuta || ["empleados", "director", "administrador", "master"].includes(subRuta)) {
       if (vista !== "inicio") {
         setCargandoVista(true); // Activa el efecto antes de cambiar vista
         setTimeout(() => {
           setVista("inicio");
           router.push(`/dashboard/${subRuta || "empleados"}`, { shallow: true });
           setCargandoVista(false); // Desactiva el efecto después de cambiar vista
         }, 300);
       }
     } else {
       if (vista !== subRuta) {
         setCargandoVista(true);
         setTimeout(() => {
           setVista(subRuta);
           setCargandoVista(false);
         }, 300);
       }
     }
   }, [pathname, router]);
 
   // Evita redirecciones innecesarias según el tipo de usuario
   useEffect(() => {
     if (!userType) return;
 
     const permisos = {
       1: ["parroquias", "comunas", "consejos-comunales", "usuarios", "circuitos-comunales", "cargos", "voceros", "perfil", "cambiar-clave"],
       2: ["parroquias", "comunas", "consejos-comunales", "usuarios", "circuitos-comunales", "cargos", "voceros", "perfil", "cambiar-clave"],
       3: ["consejos-comunales", "circuitos-comunales", "cargos", "voceros", "perfil", "cambiar-clave"],
       4: ["consejos-comunales", "circuitos-comunales", "cargos", "voceros", "perfil", "cambiar-clave"],
     };
 
     const rutasPorDefecto = {
       1: "/dashboard/master",
       2: "/dashboard/administrador",
       3: "/dashboard/director",
       4: "/dashboard/empleados",
     };
 
     const subRuta = pathname.split("/").pop();
     if (!permisos[userType]?.includes(subRuta)) {
       router.replace(rutasPorDefecto[userType], { shallow: true });
     }
   }, [pathname, router, userType]);
 
   console.log(vista);
   
 
   return (
     <>
       {usuarioActivo && (
         <div className={`flex flex-col ${abrirPanel ? "" : "container mx-auto px-2"} `}>
           <div
             className={`fixed inset-y-0 left-0 transform ${
               abrirPanel ? "translate-x-0" : "-translate-x-full"
             } transition-transform duration-500 ease-in-out w-48 z-30`}
           >
             <MenuLateralUsuario vista={vista} cambiarRuta={setVista} abrirPanel={abrirPanel} id_rol={usuarioActivo.id_rol} />
           </div>
 
           <div className={`grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 ${abrirPanel ? "ml-48 px-2 " : "ml-0"} transition-all duration-500 ease-in-out`}>
             <header>
               <HeaderUsuarios abrirDashboar={() => setAbrirPanel(!abrirPanel)} abrirPanel={abrirPanel} usuarioActivo={usuarioActivo} />
             </header>
 
             <main className="bg-[#faf5f8] rounded-md">
               {cargandoVista ? (
                 <p className="text-center text-gray-600">Cambiando vista...</p>
               ) : (
                 <>
                   {vista === "parroquias" && <ParroquiasForm mostrar={mostrarModal} abrirModal={abrirModal} cerrarModal={cerrarModal} />}
                   {vista === "cargos" && <CargosForm />}
                   {vista === "comunas" && <ComunasForm mostrar={mostrarModal} abrirModal={abrirModal} cerrarModal={cerrarModal} />}
                   {vista === "circuitos-comunales" && <CircuitoForm />}
                   {vista === "consejos-comunales" && <ConsejoForm />}
                   {vista === "voceros" && <VoceroForm />}
                   {vista === "perfil" && <MostrarPerfilUsuario abrirPanel={abrirPanel} />}
                   {vista === "cambiar-clave" && <MostrarCambiarClaveUsuario abrirPanel={abrirPanel} />}
                 </>
               )}
             </main>
 
             <Footer />
           </div>
         </div>
       )}
     </>
   );
 }
 */


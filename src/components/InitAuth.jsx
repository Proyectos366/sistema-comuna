"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { consultarUsuarioActivo } from "@/store/features/auth/thunks/consultarUsuarioActivo";

export default function InitAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(consultarUsuarioActivo()).unwrap();
      } catch (error) {
        console.log("Error al consultar usuario:", error);
        router.push("/");
      }
    };

    initAuth();
  }, [dispatch, router]);

  return null;
}

// // components/InitAuth.js
// "use client";

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { consultarUsuarioActivo } from "@/store/features/auth/thunks/consultarUsuarioActivo";

// export default function InitAuth() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(consultarUsuarioActivo());
//   }, [dispatch]);

//   return null;
// }

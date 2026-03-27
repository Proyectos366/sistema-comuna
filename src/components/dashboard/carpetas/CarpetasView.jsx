
import React from 'react'
  import { useSelector } from 'react-redux';

export default function CarpetasView() {


const { id, nombre, nivel, seccion } = useSelector((state) => state.estantes.estanteActual);

  console.log(id, nombre, nivel, seccion);
  
  return (
    <div>CarpetasView</div>
  )
}

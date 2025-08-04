"use client";

import { useEffect } from "react";
import SelectOpcion from "../SelectOpcion";
import Formulario from "../Formulario";
import LabelInput from "../inputs/LabelInput";
import Input from "../inputs/Input";
import BotonAceptarCancelar from "../BotonAceptarCancelar";

export default function FormCrearConsejo({
  setIdParroquia,
  idParroquia,
  idComuna,
  idCircuito,
  cambiarSeleccionComuna,
  cambiarSeleccionCircuito,
  cambiarDondeGuardar,
  parroquias,
  comunas,
  circuitos,
  dondeGuardar,
  nombreComuna,
  nombreCircuito,
  nombreConsejo,
  setNombreParroquia,
  setNombreComuna,
  setNombreCircuito,
  setNombreConsejo,
  abrirModal,
  limpiarCampos,
}) {
  useEffect(() => {
    if (idComuna || idCircuito) {
      const resultComuna = comunas.find((c) => c.id === idComuna);
      const resultParroquia = parroquias.find(
        (c) => c.id === resultComuna.id_parroquia
      );

      setNombreParroquia(resultParroquia?.nombre);
      setIdParroquia(resultParroquia?.id);
    }
  }, [idComuna, idCircuito]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <SelectOpcion
        idOpcion={dondeGuardar}
        nombre={"Pertenece a"}
        handleChange={cambiarDondeGuardar}
        opciones={[
          { id: 1, nombre: "COMUNA" },
          { id: 2, nombre: "CIRCUITO COMUNAL" },
        ]}
        seleccione={"Seleccione"}
        indice={1}
      />

      {dondeGuardar === 1 && (
        <SelectOpcion
          idOpcion={idComuna}
          nombre={"Comunas"}
          handleChange={cambiarSeleccionComuna}
          opciones={comunas}
          seleccione={"Seleccione"}
          indice={1}
          setNombre={setNombreComuna}
        />
      )}

      {dondeGuardar === 2 && (
        <SelectOpcion
          idOpcion={idCircuito}
          nombre={"Circuitos"}
          handleChange={cambiarSeleccionCircuito}
          opciones={circuitos}
          seleccione={"Seleccione"}
          indice={1}
          setNombre={setNombreCircuito}
        />
      )}

      {dondeGuardar !== 0 && (idComuna || idCircuito) && (
        <>
          <LabelInput nombre={"Nombre"}>
            <Input
              type={"text"}
              value={nombreConsejo}
              onChange={(e) => setNombreConsejo(e.target.value)}
            />
          </LabelInput>

          <div className="flex space-x-3">
            <BotonAceptarCancelar
              indice={"aceptar"}
              aceptar={abrirModal}
              nombre={"Crear"}
              campos={{
                nombreConsejo,
                idComuna,
              }}
            />

            <BotonAceptarCancelar
              indice={"limpiar"}
              aceptar={() => {
                limpiarCampos({ setNombreConsejo });
              }}
              nombre={"Limpiar"}
              campos={{
                nombreConsejo,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
  );
}

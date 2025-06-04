import Link from "next/link";
import Main from "@/components/Main";

export default function NotFound() {
  return (
    <Main>
      <section className="flex flex-col space-y-5 items-center">
        <h6 className="text-4xl">Pagina no encontrada</h6>
        <Link
          className="border border-black w-40 rounded-md py-2 px-10"
          href={"/"}
        >
          Ir a login
        </Link>
      </section>
    </Main>
  );
}

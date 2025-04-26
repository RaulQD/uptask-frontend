import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
        <Seo
            title='Página No Encontrada - UpTask'
            description='Lo sentimos, la página que buscas no existe. Regresa a la página principal.'
            keywords='404, página no encontrada, error, uptask'
            canonical='/404'
        />
        <h1 className="font-black text-center text-4xl text-white">Página No Encontrada</h1>
        <p className="mt-10 text-center text-white">
            Tal vez quieras volver a {' '}
            <Link className=" text-fuchsia-500" to={'/'}>Proyectos</Link>
        </p>
    </>
  )
}

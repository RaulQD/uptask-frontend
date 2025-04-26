import Tabs from "@/components/profile/Tabs";
import { Seo } from "@/components/Seo";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <>
      <Seo 
        title="Perfil - UpTask"
        description="Gestión de proyectos y tareas"
        keywords="uptask, gestión de proyectos, tareas, perfil"
      />
        <Tabs />
        <Outlet />
    </>
  )
}

import ProfileForm from "@/components/profile/ProfileForm"
import { Seo } from "@/components/Seo"
import { useAuth } from "@/hooks/useAuth"

export default function ProfileView() {
    const { data, isLoading } = useAuth()
    if(isLoading) return 'Cargando...'
    if(data) return(
        <>
            <Seo
                title='Perfil - UpTask'
                description='Actualiza tu perfil en UpTask, incluyendo tu nombre y correo electrónico.'
                keywords='uptask, perfil, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/profile'
            />
             <ProfileForm data={data}/>
        </>
    ) 
}

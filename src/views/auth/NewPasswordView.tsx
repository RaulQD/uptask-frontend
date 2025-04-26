import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { useState } from "react"
import { ConfirmToken } from "@/types/index"
import { Seo } from "@/components/Seo"

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
            <Seo
                title='Reestablecer Password - UpTask'
                description='Reestablece tu contraseña en UpTask y vuelve a gestionar tus proyectos de manera eficiente.'
                keywords='reestablecer contraseña, uptask, gestión de proyectos'
                canonical='https://raulqd-uptask.netlify.app/auth/new-password'
            />
            <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que recibiste {''}
                <span className=" text-fuchsia-500 font-bold">por email</span>
            </p>

            {!isValidToken ? 
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}  /> : 
                <NewPasswordForm token={token} />
            }
        </>
    )
}

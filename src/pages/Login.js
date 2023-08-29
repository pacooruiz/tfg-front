import { useNavigate } from "react-router-dom";
import '../pages/styles/Login.css'
import { useEffect, useState } from "react";

function Login(){

    const navigate = useNavigate()


    useEffect(()=>{
        if(sessionStorage.getItem("jwt") !== null){
            console.log("Puta")
            navigate("/planificaciones")
        }
    })

    const [token, setToken] = useState(null)

    function login(){
        sessionStorage.setItem("jwt", "hola")
        setToken("hola")
    }

    return(
        <>

        <div className="login-page">

            <form>
                <h2>Panel de administración</h2>
                <input placeholder="Usuario"></input>
                <input placeholder="Contraseña"></input>
                <button onClick={login}>INICIAR SESIÓN</button>
            </form>

        </div>
        
        
        
        </>
    )
}

export default Login
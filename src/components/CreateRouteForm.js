import { useEffect, useState } from "react";
import axios from 'axios';
import '../components/CreateRouteForm.css'

import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function CreateRouteForm({closeForm}){

    const [workers, setWorkers] = useState([])
    const [jobs, setJobs] = useState([])
    const [vehicles, setVehicles] = useState([])

    const [routeWorkers, setRouteWorkers] = useState([]);
    const [routeJobs, setRouteJobs] = useState([]);
    const [routeVehicles, setRouteVehicles] = useState([]);
    const [routeStartDate, setRouteStartDate] = useState(null);
    const [routeEndDate, setRouteEndDate] = useState(null);
    const [routeTitle, setRouteTitle] = useState(null);

    const [showCreatedRoute, setShowCreatedRoute] = useState(false);
    const [createdRoute, setCreatedRoute] = useState({});

    useEffect(function(){
        axios.get('http://localhost:8080/workers').then(res => 
        setWorkers(res.data))

        axios.get('http://localhost:8080/jobs').then(res => 
        setJobs(res.data))

        axios.get('http://localhost:8080/vehicles').then(res => 
        setVehicles(res.data))
    }, [])

    const nav = useNavigate()

    function createRouteRequest(){

        var time = document.getElementById("min").value * 60 
        time = time + parseInt(document.getElementById("sec").value)

        document.getElementById("waiting").style.display="block";

        var currentDate = Date.parse(routeStartDate)
        var endDate = Date.parse(routeEndDate)

        var route = {
            title: routeTitle,
            startDate: currentDate,
            endDate: endDate,
            workers: routeWorkers,
            jobs: routeJobs,
            vehicles: routeVehicles,
            time: time
        }

        axios.post('http://localhost:8080/plannings/generate', route).then(res => {
            
            if(res.status === 200){
                nav("/planificacion/" + res.data.id)
            }
            //document.getElementById("waiting").style.display="none";
            //closeForm()
        })
        
        
        
    }

    function handleWorker(e){

        if(e.target.checked){
            setRouteWorkers([...routeWorkers, workers.filter((w) => w.id === e.target.id)[0]])
        }
        else{
            setRouteWorkers(routeWorkers.filter((w) => w.id !== e.target.id))
        }
    }

    function handleJob(e){

        if(e.target.checked){
            setRouteJobs([...routeJobs, jobs.filter((j) => j.id === e.target.id)[0]])
        }
        else{
            setRouteJobs(routeJobs.filter((j) => j.id !== e.target.id))
        }
    }

    function handleVehicle(e){

        if(e.target.checked){
            setRouteVehicles([...routeVehicles, vehicles.filter((v) => v.id === e.target.id)[0]])
        }
        else{
            setRouteVehicles(routeVehicles.filter((v) => v.id !== e.target.id))
        }
    }

    function handleStartDate(e){
        setRouteStartDate(e.target.value)
    }

    function handleEndDate(e){
        setRouteEndDate(e.target.value)
    }

    function formatDate(timeInMillis){
        console.log(timeInMillis)
        var date = new Date(timeInMillis);
        var dateString = date.toUTCString()
        return dateString.substring(0, dateString.length-3);
    }


    return (
        <>
        {showCreatedRoute && 
        <div>
            <div className="dates">
            {createdRoute.routes.map((r) => { return <label>{r.date}</label>})}
            </div>
            {createdRoute.routes.filter((r) => r.date === '2023-07-05').map((r) => { return(
            <div className="routeElements">
                <div className="routeVehicle">
                Vehículo: {r.vehicleId}
                <br></br>
                Inicio: {formatDate(r.workStartDateTime)}
                <br></br>
                Fin: {formatDate(r.workEndDateTime)}
                </div>
                <div>
                {r.jobs.map((j) => {
                    return(
                        <>
                        {j.title}. Inicio: {formatDate(j.startTime)}. Fin: {formatDate(j.endTime)}
                        </>
                        
                    )
                })}
                </div>
                
            </div>)
            })}      

        </div>}
        {!showCreatedRoute &&
        <div className="create-route-form">
            <h1>Nueva planificación</h1>

            <div className="calc-time">
                <h4>Tiempo de cálculo</h4>
                <div>
                <span>Minutos:</span><input type="number" id="min"></input>
                </div>
                <div>
                <span>Segundos:</span><input type="number" id="sec"></input>
                </div>                
            </div>

            <div className="title">
                <h3>Título</h3>
                <input type="text" onChange={(e) => setRouteTitle(e.target.value)}></input>
            </div>
            <div className="dates">
                <h3>Fecha de inicio y fin</h3>
                <ul>
                    <li><input type="date" onChange={(e) => handleStartDate(e)}></input></li>
                    <li><input type="date" onChange={(e) => handleEndDate(e)}></input></li>
                </ul>
            </div>
            <div className="checkboxs">
                <div className="checkbox-group">
                    <h2>Trabajadores</h2>
                    <table className="workersTable">
                        <thead>
                            <tr>
                                <th className="checkbox-th"></th>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((w) => {
                                return(
                            <tr>
                                <td><input type="checkbox" id={w.id} className="select" onChange={(e) => handleWorker(e)}></input></td>
                                <td>{w.id}</td>
                                <td>{w.name}</td>
                                <td>{w.startTime}</td>
                                <td>{w.endTime}</td>
                            </tr>
                                )
                            })} 
                        </tbody>
                    </table>
                </div>
                <div className="checkbox-group">
                    <h2>Vehículos activos</h2>
                    <table className="workersTable">
                        <thead>
                            <tr>
                                <th className="checkbox-th"></th>
                                <th>ID</th>
                                <th>Deṕosito</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.filter((v) => v.status==="a").map((v) => {
                                return(
                            <tr>
                                <td><input type="checkbox" id={v.id} className="select" onChange={(e) => handleVehicle(e)}></input></td>
                                <td>{v.id}</td>
                                <td>{v.depot.name}</td>
                            </tr>
                                )
                            })} 
                        </tbody>
                    </table>
                </div>
                <div className="checkbox-group">
                    <h2>Trabajos</h2>
                    <table className="workersTable">
                        <thead>
                            <tr>
                                <th className="checkbox-th"></th>
                                <th>Título</th>
                                <th>Planificado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((j) => {
                                return(
                            <tr>
                                <td><input type="checkbox" id={j.id} className="select" onChange={(e) => handleJob(e)}></input></td>
                                <td>{j.title}</td>
                                <td>NO</td>
                            </tr>
                                )
                            })} 
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="buttons">
                <button className="cancel" onClick={() => closeForm()}>Cancelar</button>
                <button className="calc" onClick={() => createRouteRequest()}>CALCULAR</button>
            </div>

            <div className="waiting" id="waiting">
                <div>
                    <ClipLoader
                        loading={true}
                        color="#36d7b7"
                        size={340}
                    />
                </div>
            
            <p>Calculando rutas</p>
            </div>

        </div>
        }
        </>
    )
}

export default CreateRouteForm;
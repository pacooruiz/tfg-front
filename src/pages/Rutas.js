import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar'
import '../pages/styles/Rutas.css'
import CreateRouteForm from '../components/CreateRouteForm';
import axios from 'axios';
import DeleteModal from '../components/DeleteModal';
import Route from '../components/Route'

function Rutas(){

    const [routes, setRoutes] = useState([])

    const [showRoutesList, setShowRoutesList] = useState(true)
    const [showRouteDetail, setShowRouteDetail] = useState(false)
    const [showCreateRoute, setShowCreateRoute] = useState(false)

    const [routeToSee, setRouteToSee] = useState(null)

    useEffect(function(){
        axios.get('http://localhost:8080/plannings').then(res => 
        setRoutes(res.data)
        )
    }, [showRoutesList])

    function formatDate(timeInMillis){
        var date = new Date(timeInMillis);
        var dateString = date.toLocaleString()
        return dateString.substring(0, dateString.length-9);
    }

    function deleteRoute(planningId){

        axios.delete('http://localhost:8080/planning?id=' + planningId).then(res => {
            console.log(res.status)
            if(res.status === 200){
                setRoutes(routes.filter(r => r.id !== planningId))
            }
        })
    }


    function openCreateRouteForm(){
        setShowCreateRoute(true)
        setShowRoutesList(false)
        setShowRouteDetail(false)
    }

    function closeCreateRouteForm(){
        setShowCreateRoute(false)
        setShowRoutesList(true)
        setShowRouteDetail(false)
    }

    return(
        <div>
            <NavBar></NavBar>

            {showCreateRoute && <CreateRouteForm closeForm={closeCreateRouteForm}></CreateRouteForm>}
            {showRouteDetail && <Route route={routeToSee}></Route>}
            {showRoutesList &&
            <div className='content'>
                <div className="top">
                    <h1>Planificaciones ({routes.length})</h1>
                    <div className="addButton" onClick={() => openCreateRouteForm()}>CREAR PLANIFICACIÓN</div>
                </div>
                <div>
                    <table className="workersTable">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th style={{textAlign: "center"}} className="actions-column-style">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map((r) => {
                                return(
                                <tr key={r.id}>
                                    <td>{r.title}</td>
                                    <td>{r.start}</td>
                                    <td>{r.end}</td>
                                    <td>
                                        <div className="actions">
                                            <div>
                                            <a href={'/planificacion/' + r.id}><span className='view-route-button'>Ver</span></a>
                                            </div>
                                        
                                            <div>
                                                <DeleteModal message={"la ruta \"" + r.title + "\""} idToDelete={r.id} deleteFunction={deleteRoute}></DeleteModal>
                                            </div>
                                        </div>
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
                
            </div>
            }
            
        </div>
    );
}

export default Rutas
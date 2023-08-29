import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import "../pages/styles/Trabajadores.css"
import AddWorkersModal from "../components/AddWorkerModal";
import axios from "axios";
import DeleteModal from '../components/DeleteModal';
import EditWorkerModal from "../components/EditWorkerModal";

function Trabajadores(){

    const [workers, setWorkers] = useState([])

    useEffect(function(){
        axios.get('http://localhost:8080/workers').then(res => 
        setWorkers(res.data)
        )
    }, [])

    function addWorker(data){

        axios.post("http://localhost:8080/workers", {
            id: data.id,
            name: data.name,
            fixedCost: data.fixedCost,
            variableCost: data.variableCost,
            startTime: data.startTime,
            endTime: data.endTime
        })
        .then(res => {

            if(res.status === 200){
                setWorkers([...workers, data])
            }            
        })
    }

    function deleteWorker(workerId){

        axios.delete('http://localhost:8080/workers?id=' + workerId).then(res => {
            if(res.status === 204){
                setWorkers(workers.filter(w => w.id !== workerId))
            }
        })
    }

    function editWorker(worker){


        setWorkers([...workers.filter(w => w.id !== worker.id), worker])

    }

    console.log(workers)

    return (
        <div>
            <NavBar></NavBar>
            <div className="content">
                <div className="top">
                    <h1>Trabajadores ({workers.length})</h1>
                    <AddWorkersModal newWorker={addWorker}></AddWorkersModal>
                </div>
                <table className="workersTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Coste fijo (€/día)</th>
                            <th>Coste variable (€/h)</th>
                            <th>Inicio jornada</th>
                            <th>Finalización jornada</th>
                            <th style={{textAlign: "center"}} className="actions-column-style">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map((worker) => { 
                            return(
                            <tr key={worker.id}>
                                <td>{worker.id}</td>
                                <td>{worker.name}</td>
                                <td>{worker.fixedCost}</td>
                                <td>{worker.variableCost}</td>
                                <td>{worker.startTime}</td>
                                <td>{worker.endTime}</td>
                                <td>
                                    <div className="actions">
                                        <div>
                                            <EditWorkerModal worker={worker} editFunction={editWorker}></EditWorkerModal>
                                        </div>
                                        <div>
                                            <DeleteModal message={"el trabajador " + worker.id} idToDelete={worker.id} deleteFunction={deleteWorker}></DeleteModal>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Trabajadores
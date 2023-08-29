import NavBar from '../components/NavBar'
import { useEffect, useState } from "react";
import axios from "axios";
import '../pages/styles/Vehiculos.css'
import AddVehicleModal from '../components/AddVehicleModal'
import DeleteModal from '../components/DeleteModal';
import EditVehicleModal from '../components/EditVehicleModal';

function Vehiculos(){

    const [vehicles, setVehicles] = useState([])

    useEffect(function(){
        axios.get('http://localhost:8080/vehicles').then(res => 
        setVehicles(res.data)
        )
    }, [])

    function addVehicle(data){

        axios.post("http://localhost:8080/vehicles", {
            dni: data.dni,
            name: data.name,
            fixedCost: data.fixedCost,
            variableCost: data.variableCost,
            startTime: data.startTime,
            endTime: data.endTime
        })
        .then(res => {

            if(res.status === 200){
                data.status = 'a'
                setVehicles([...vehicles, data])
            }            
        })
    }

    function deleteVehicle(vehicleId){

        axios.delete('http://localhost:8080/vehicles?id=' + vehicleId).then(res => {
            if(res.status === 200){
                setVehicles(vehicles.filter(v => v.id !== vehicleId))
            }
        })
        
    }

    function editVehicle(vehicle){

        setVehicles([...vehicles.filter(v => v.id !== vehicle.id), vehicle])
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className="content">

                <div className="top">
                    <h1>Vehículos ({vehicles.length})</h1>
                    <AddVehicleModal addFunction={addVehicle}></AddVehicleModal>
                </div>
                <table className="workersTable">
                    <thead>
                        <tr>
                            <th>Estado</th>
                            <th>Matrícula</th>
                            <th>Depósito</th>
                            <th>Carga máxima (kg)</th>
                            <th>Nº asientos</th>
                            <th>Coste fijo (€/día)</th>
                            <th>Coste variable (€/km)</th>
                            <th style={{textAlign: "center"}} className="actions-column-style">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => { 
                            return(
                            <tr key={vehicle.id}>
                                <td>{ (vehicle.status === "a") ? (<span className='vehicle-status-active'>ACTIVO</span>) : (<span className='vehicle-status-inactive'>INACTIVO</span>)}</td>
                                <td>{vehicle.id}</td>
                                <td>Córdoba</td>
                                <td>{vehicle.maxLoad}</td>
                                <td>{vehicle.seats}</td>
                                <td>{vehicle.fixedCost}</td>
                                <td>{vehicle.variableCost}</td>
                                <td>
                                    <div className="actions">
                                        <div>
                                            <EditVehicleModal vehicle={vehicle} editFunction={editVehicle}></EditVehicleModal>
                                        </div>
                                        <div>
                                            <DeleteModal message={"el vehículo con matrícula " + vehicle.id} idToDelete={vehicle.id} deleteFunction={deleteVehicle}></DeleteModal>
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

export default Vehiculos
import { useState, useEffect } from 'react'
import '../components/DeleteModal.css'
import '../components/EditVehicleModal.css'
import axios from 'axios';

function EditVehicleModal(props){

    const [showModal, setShowModal] = useState(false)

    const toogleModal = () => {
        setShowModal(!showModal)
    }

    const [data, setData] = useState(props.vehicle)

    function activateDesactivate(e){

        const newdata={...data}
        if(e.target.id === 'active' && e.target.checked){
            newdata.status = 'a'
        }
        else if(e.target.id === 'inactive' && e.target.checked){
            newdata.status = 'b'
        }

        setData(newdata)
    }

    function handle(e){
        const newdata={...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
    }

    const [depots, setDepots] = useState([])

    useEffect(function(){
        axios.get('http://localhost:8080/depots').then(res => 
        setDepots(res.data))
    }, [])

    return (
        (
        <>
            <span onClick={toogleModal} className='editButton actionButton'>Editar</span>
            {showModal && (
            <div className='modal'>
                <div className="modal-content">
                <h2>EDITAR VEHÍCULO</h2>
                    <form onSubmit={(e) => {e.preventDefault(); toogleModal(); props.editFunction(data)}}>
                        <div>
                            <label>Matrícula</label>
                            <input type='text' disabled value={data.id}></input>
                        </div>
                        <div>
                            <label>Depósito</label>
                            <select onChange={(e) => handle(e)} id="depot">
                                {depots.map((d) => {
                                    return(
                                        <option value={d.id}>{d.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div>
                            <label>Carga máxima (kg)</label>
                            <input type='number' onChange={(e) => handle(e)} id='maxLoad' value={data.maxLoad}></input>
                        </div>
                        <div>
                            <label>Nº de asientos</label>
                            <input type='number' onChange={(e) => handle(e)} id='seats' value={data.seats}></input>
                        </div>
                        <div>
                            <label>Coste fijo (€)</label>
                            <input type='number' onChange={(e) => handle(e)} id='fixedCost' value={data.fixedCost}></input>
                        </div>
                        <div>
                            <label>Coste variable (€)</label>
                            <input type='number' onChange={(e) => handle(e)} id='variableCost' value={data.variableCost}></input>
                        </div>
                        <div>
                            <label>Estado</label>
                            <div className='change-status'>
                                
                                <input type='radio' name='status' id='active' defaultChecked={data.status==='a'} onChange={(e) => activateDesactivate(e)}></input>
                                <label for='active'>Activo</label>
                                
                                <input type='radio' name='status' id='inactive' defaultChecked={data.status!=='a'} onChange={(e) => activateDesactivate(e)}></input>
                                <label for='inactive'>Inactivo</label>
                            </div>
                        </div>
                        <div className='add-modal-buttons'>
                            <button onClick={toogleModal} className='add-edit-cancel-button'>Cancelar</button>
                            <button className='add-button'>GUARDAR</button>
                        </div>
                    </form>         
                </div>
            </div>
            )}
        </>
        )
    )

}

export default EditVehicleModal
import { useState } from 'react'
import '../components/AddVehicleModal.css'

function AddWorkersModal(props){

    const [showModal, setShowModal] = useState(false)

    const toogleModal = () => {
        setShowModal(!showModal)
    }

    const [data, setData] = useState({})

    function handle(e){
        console.log(e)
        const newdata={...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
    }

    return (
        (
        <>
            <div className="addButton" onClick={toogleModal}>AÑADIR VEHÍCULO</div>
            {showModal && (
            <div className='modal'>
                <div className="modal-content">
                    <h2>AÑADIR VEHÍCULO</h2>
                    <form onSubmit={(e) => {e.preventDefault(); toogleModal(); props.addFunction(data)}}>
                        <div>
                            <label>Matrícula</label>
                            <input type='text' onChange={(e) => handle(e)} id='id' value={data.id}></input>
                        </div>
                        <div>
                            <label>Depósito</label>
                            <select onChange={(e) => handle(e)} id='depot'>
                                <option value={1}>Córdoba</option>
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
                        <div className='add-modal-buttons'>
                            <button onClick={toogleModal} className='add-edit-cancel-button'>Cancelar</button>
                            <button className='add-button'>AÑADIR</button>
                        </div>
                    </form>         
                </div>
            </div>
            )}
        </>
        )
    )

}

export default AddWorkersModal
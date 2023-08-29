import { useState } from 'react'
import '../components/AddWorkersModal.css'

function AddWorkersModal(props){

    const [showModal, setShowModal] = useState(false)

    const toogleModal = () => {
        setShowModal(!showModal)
    }

    const [data, setData] = useState({
        id : "",
        name : "",
        fixedCost : 0,
        variableCost : 0,
        startTime : "",
        endTime : ""

    })

    function handle(e){
        const newdata={...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
    }

    return (
        (
        <>
            <div className="addButton" onClick={toogleModal}>AÑADIR TRABAJADOR</div>
            {showModal && (
            <div className='modal'>
                <div className="modal-content">
                    <h2>AÑADIR TRABAJADOR</h2>
                    <form onSubmit={(e) => {e.preventDefault(); props.newWorker(data)}}>
                        <div>
                            <label>DNI</label>
                            <input type='text' onChange={(e) => handle(e)} id='id' value={data.id}></input>
                        </div>
                        <div>
                            <label>Nombre y Apellidos</label>
                            <input type='text' onChange={(e) => handle(e)} id='name' value={data.name}></input>
                        </div>
                        <div>
                            <label>Coste fijo</label>
                            <input type='number' onChange={(e) => handle(e)} id='fixedCost' value={data.fixedCost}></input>
                        </div>
                        <div>
                            <label>Coste variable</label>
                            <input type='number' onChange={(e) => handle(e)} id='variableCost' value={data.variableCost}></input>
                        </div>
                        <div>
                            <label>Hora de incio de jornada</label>
                            <input type='time' onChange={(e) => handle(e)} id='startTime' value={data.startTime}></input>
                        </div>
                        <div>
                            <label>Hora de fin de jornada</label>
                            <input type='time' onChange={(e) => handle(e)} id='endTime' value={data.endTime}></input>
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
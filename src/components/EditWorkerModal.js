import { useState } from 'react'
import '../components/DeleteModal.css'

function EditWorkerModal(props){

    const [showModal, setShowModal] = useState(false)

    const toogleModal = () => {
        setShowModal(!showModal)
    }

    const [data, setData] = useState(props.worker)

    function handle(e){
        const newdata={...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
    }

    return (
        (
        <>
            <span onClick={toogleModal} className='editButton actionButton'>Editar</span>
            {showModal && (
            <div className='modal'>
                <div className="modal-content">
                    <h2>EDITAR TRABAJADOR</h2>
                    <form onSubmit={(e) => {e.preventDefault(); toogleModal(); props.editFunction(data)}}>
                        <div>
                            <label>DNI</label>
                            <input type='text' disabled value={data.id}></input>
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

export default EditWorkerModal
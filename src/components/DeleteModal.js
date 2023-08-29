import { useState } from 'react'
import '../components/DeleteModal.css'

function DeleteModal(props){

    const [showModal, setShowModal] = useState(false)

    const toogleModal = () => {
        setShowModal(!showModal)
    }

    return (
        (
        <>
            <span onClick={toogleModal} className='deleteButton actionButton'>Eliminar</span>
            {showModal && (
            <div className='delete-modal'>
                <div className="delete-modal-content">
                    
                    <p>¿Está seguro de que desea eliminar {props.message}?</p>
                    <div className='buttons'>
                        <button onClick={toogleModal} className='cancel-button'>Cancelar</button>
                        <button onClick={() => {props.deleteFunction(props.idToDelete)}} className='confirm-delete-button'>ELIMINAR</button>
                    </div>
                       
                </div>
            </div>
            )}
        </>
        )
    )

}

export default DeleteModal
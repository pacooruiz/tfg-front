import { useState } from "react";

function AddJobForm({addFunction, closeAddJobForm, lastClickedLocation}){

    lastClickedLocation.current = {lat: null, lng: null}

    const [data, setData] = useState({})

    function handle(e){
        const newdata={...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
    }

    return (
        < div className='add-job-form'>
        <h2>Añadir Trabajo</h2>
        <form onSubmit={(e) => {e.preventDefault(); closeAddJobForm(); addFunction(data); setData({})}}>
            <div>
                <label>Título</label>
                <input type='text' onChange={(e) => handle(e)} id='title' value={data.title}></input>
            </div>
            <div>
                <label>Descripción</label>
                <textarea onChange={(e) => handle(e)} id='description' value={data.description}></textarea>
            </div>
            <ul>
                <li>
                    <div>
                        <label>Fecha mínima de inicio</label>
                        <input type='datetime-local' onChange={(e) => handle(e)} id='earliestDateTime' value={data.earliestDateTime}></input>
                    </div>
                </li>
                <li>
                    <div>
                        <label>Fecha máxima de finalización</label>
                        <input type='datetime-local' onChange={(e) => handle(e)} id='lastestDateTime' value={data.lastestDateTime}></input>
                    </div>
                </li>
            </ul>
            <div>
                <label>Duración (minutos)</label>
                <input type='number' onChange={(e) => handle(e)} id='duration' value={data.duration}></input>
            </div>
            <div>
                <label>Trabajadores requeridos</label>
                <input type='number' onChange={(e) => handle(e)} id='workersNeeded' value={data.workersNeeded}></input>
            </div>
            <div>
                <label>Carga necesaria (kg)</label>
                <input type='number' onChange={(e) => handle(e)} id='loadNeeded' value={data.loadNeeded}></input>
            </div>
            {(lastClickedLocation.current.lat===null || lastClickedLocation.current.lng===null) && <p>Seleccione la localización en el mapa</p>}
            <div className='add-job-form buttons'>
                <button onClick={() => closeAddJobForm()} className='add-edit-cancel-button'>Cancelar</button>
                <button className='add-button'>AÑADIR</button>
            </div>
        </form>
        </div>
    )
}

export default AddJobForm
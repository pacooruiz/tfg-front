import DeleteModal from './DeleteModal'
import './Job.css'

function Job(props){

    function openMoreInfo(jobId){
        if(document.getElementById("info-"+jobId).classList.contains("info-block")){
            document.getElementById("info-"+jobId).classList.remove("info-block")
            document.getElementById("more-"+jobId).innerHTML = "Más información"
        }
        else{
            document.getElementById("info-"+jobId).classList.add("info-block")
            document.getElementById("more-"+jobId).innerHTML = "Mostrar menos"
        }
        
    }

    function formatDate(timeInMillis){
        console.log(timeInMillis)
        var date = new Date(timeInMillis);
        var dateString = date.toLocaleString()
        return dateString.substring(0, dateString.length-3);
    }

    return (
        <div key={props.job.id}>
            <div className='job'>
                <div className='title-bar'>
                    <h3 className='job-title'>{props.job.title}</h3>
                    <div className='job-actions'>
                        <DeleteModal message={"el trabajo \""+ props.job.title +"\""} idToDelete={props.job.id} deleteFunction={props.deleteFunction}></DeleteModal>
                    </div>
                </div>
                <span className='label'>Fecha mínima de inicio: </span><span>{formatDate(props.job.earliestStartDateTime)}</span>
                <br></br>
                <span className='label'>Fecha máxima de finalización: </span><span>{formatDate(props.job.lastestEndDateTime)}</span>
                <div className='info' id={"info-" + props.job.id}>
                    <ul>
                        <li><span className='label'>Duración:</span> {getDisplayDuration(props.job.duration)}</li>
                        <li><span className='label'>Número trabajadores requeridos:</span> {props.job.workersNeeded}</li>
                        <li><span className='label'>Carga necesaria:</span> {props.job.loadNeeded} kg</li>
                        <li><span className='label'>Descripción:</span> {props.job.description}</li>
                    </ul>
                    <p className='planned'><span className='label'>Planificado en:</span></p>
                    <ul className='plannings'>
                    {props.job.plannings.map((p) => {
                        return(
                            <li>- {p}</li>
                        )
                    })}
                    </ul>
                </div>
                <div className='more-buttons'>
                    <span className='more' onClick={() => openMoreInfo(props.job.id)} id={'more-' + props.job.id}>Más información</span>
                    <span className='select-map' onClick={() => props.viewOnMap([props.job.location.latitude, props.job.location.longitude])}>Seleccionar en el mapa</span>
                </div>
            </div>
            <hr/>
        </div>
        
    )
}

function getDisplayDuration(duration){
    const hours = Math.trunc((duration/1000)/3600)
    var durationString = ''
    if(hours > 0){
        durationString = hours + "h "
    }
    const minutes = (((duration/1000)/3600)%1)*60
    if(minutes > 0){
        durationString = durationString + Math.trunc(minutes) + "m"
    }
    return durationString
}

export default Job
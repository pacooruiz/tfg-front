import { useParams } from 'react-router';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import '../pages/styles/Planificacion.css'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import RoutingMachine from '../components/RoutingMachine';
import L from 'leaflet'
import markerImage from 'leaflet/src/images/marker.svg'

function Planificacion(){

    const planningId = useParams().id;

    const [displayedVehicles, setDisplayedVehicles] = useState([])

    const [selectedRoute, setSelectedRoute] = useState(null)

    const [planning, setPlanning] = useState({})

    useEffect(function(){
        axios.get('http://localhost:8080/plannings/' + planningId).then(res => {
            if(res.status === 200){
                console.log(res.data)
                setPlanning(res.data)
            }
        })
    }, [])

    const [map, setMap] = useState(null)

    useEffect(() => {

        let center_lat = 37.891605;
        let center_long = -4.7799;
        let center_zoom = 13;

        if(selectedRoute === null){
            let mapp = L.map('map', {
            center: [center_lat, center_long],
            zoom: center_zoom
            });
    
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapp);

            setMap(mapp)

        }
        else{

            if (map && map.remove) {
                map.off();
                map.remove();
            }

            let mapp = L.map('map', {
                center: [center_lat, center_long],
                zoom: center_zoom
            });
    
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapp);

            var points = []

            points.push(L.latLng(selectedRoute.depot.latitude, selectedRoute.depot.longitude))

            selectedRoute.jobs.sort((a, b) => (a.start > b.start) ? 1 : -1).map((r) => {
                points.push(L.latLng(r.location.latitude, r.location.longitude))
            })

            points.push(L.latLng(selectedRoute.depot.latitude, selectedRoute.depot.longitude))


            L.Routing.control({
                waypoints: points,
                //createMarker: function() { return null; },
                lineOptions: {
                    styles: [{ color: "#6FA1EC", weight: 4 }]
                  },
                  show: true,
                  addWaypoints: false,
                  routeWhileDragging: true,
                  draggableWaypoints: true,
                  fitSelectedRoutes: true,
                  showAlternatives: false,
                  createMarker: function (i, waypoint, n) {

                    const marker = L.marker(waypoint.latLng).setIcon(L.icon({
                        iconUrl: markerImage,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                    }))

                    
                    return marker;
                  }
            }).addTo(mapp);

            setMap(mapp)
        }

    }, [selectedRoute]);

    var lastestInfoTabSelected = useRef(null);

    function styleInfoTabs(e){

        if(lastestVehicleTabSelected.current === null){
            return
        }

        if(lastestInfoTabSelected.current != null){
            document.getElementById(lastestInfoTabSelected.current + '-tab').classList.remove('info-tab-selected')
            document.getElementById(lastestInfoTabSelected.current + '-container').style.display = 'none'
        }

        document.getElementById(e.target.id + '-container').style.display = 'block'
        document.getElementById(e.target.id + '-tab').classList.add('info-tab-selected')
        lastestInfoTabSelected.current = e.target.id;

    }

    var lastestDateTabSelected = useRef(null)

    function styleDateTabs(e){

        if(lastestDateTabSelected.current != null){
            document.getElementById(lastestDateTabSelected.current + 'tab').classList.remove('date-tab-selected')
        }

        document.getElementById(e.target.id + '-tab').classList.add('date-tab-selected')
        lastestDateTabSelected.current = e.target.id;

        setDisplayedVehicles(planning.days.filter((d) => d.date === e.target.id)[0].routes.map((r) => r.vehicleId))

        lastestVehicleTabSelected = null

    }

    var lastestVehicleTabSelected = useRef(null);

    function styleVehicleTabs(e){

        if(lastestVehicleTabSelected.current != null){
            document.getElementById(lastestVehicleTabSelected.current + '-tab').classList.remove('vehicle-tab-selected')
        }

        document.getElementById(e.target.id + '-tab').classList.add('vehicle-tab-selected')
        lastestVehicleTabSelected.current = e.target.id;

        document.getElementById('info').click();
        document.getElementById('info-tab').classList.add('info-tab-selected')
        lastestInfoTabSelected = 'info-tab';

        setSelectedRoute(planning.days.filter((d) => d.date===lastestDateTabSelected.current)[0].routes.filter((r => r.vehicleId===lastestVehicleTabSelected.current))[0])
    }

    function getUTCTimeFromMillis(millis){
        var string = new Date(millis).toUTCString()
        return string.substring(string.length-12, string.length-7)
    }

    return(


        <>
        <div className='planning-page'>
        <a href='/planificaciones'><svg className='close-planning' href='/planificaciones' xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></a>
            <h1 className='planning-title'>{planning.title}</h1>
            <div className='planning-content'>
                
                <div className='planning-data'>
                    <div className='date-tabs'>

                        {planning.days !== undefined && planning.days.map((d) => {
                            return(
                                <>
                                <label htmlFor={d.date} id={d.date + '-tab'}>{d.date}</label><input type='radio' id={d.date} onChange={(e) => styleDateTabs(e)} name='date-tabs'></input>
                                </>
                            )
                        })}

                    </div>
                    <div className='vehicles'>
                        {displayedVehicles.map((v) => {
                            return(
                                <>
                                <label className='vehicle' htmlFor={v} id={v + "-tab"}>{v}</label><input type='radio' id={v} onChange={(e) => styleVehicleTabs(e)} name='vehicle-tabs'></input>
                                </>
                            )
                        })}

                    </div>
                    <div className='route'>
                        <div className='route-tabs'>
                            <label htmlFor='info' id='info-tab'>Información</label><input type='radio' id='info' onChange={(e) => styleInfoTabs(e)} name='info-tabs'></input>
                            <label htmlFor='workers' id='workers-tab'>Trabajadores</label><input type='radio' id='workers' onChange={(e) => styleInfoTabs(e)} name='info-tabs'></input>
                            <label htmlFor='jobs' id='jobs-tab'>Trabajos</label><input type='radio' id='jobs' onChange={(e) => styleInfoTabs(e)} name='info-tabs'></input>
                        </div>
                        <div className='route-data'>
                            <div id='info-container'>
                                <div>Km totales recorridos: </div>
                                <div>Tiempo total: </div>
                                <div>Carga máxima del vehículo: </div>
                                <div>Carga requerida por la ruta: </div>
                                <div>Número de trabajadores: </div>
                                <div>Número de asientos del vehículo: </div>
                            </div>
                            <div id='workers-container'>

                                { (selectedRoute!==null) && 

                                    <>
                                    <div>Horario de jornada: {getUTCTimeFromMillis(selectedRoute.workers[0].start)} - {getUTCTimeFromMillis(selectedRoute.workers[0].end)}</div>
                                    </>

                                }

                                <ul>
                                {selectedRoute!==null && selectedRoute.workers.map((w) => {
                                    return(
                                        <>
                                        <li>{w.id} - {w.name}</li>
                                        </>
                                    )
                                })}
                                </ul>
                            </div>
                            <div id='jobs-container'>
                                { (selectedRoute!==null) && 
                                <div  className='start'>
                                    Inicio: {getUTCTimeFromMillis(selectedRoute.workStartDateTime)}
                                </div>
                                }
                                
                                <div className='depot'>
                                    <div className='depot-draw'>
                                        <div className='depot-icon'></div>
                                        <div className='depot-line'></div>
                                    </div>
                                    { (selectedRoute!==null) && 
                                    <div className='start-depot-info'>
                                        Depósito: {selectedRoute.depot.name}
                                    </div>
                                    }
                                </div>

                                {selectedRoute!==null && selectedRoute.jobs.sort((a, b) => (a.start > b.start) ? 1 : -1).map((j) => {
                                    return(
                                    <div className='job-element'>
                                        <div className='job-draw'>
                                            <div className='job-line'></div>
                                            <div className='job-icon'></div>
                                            <div className='job-line'></div>
                                        </div>
                                        <div className='job-info'>
                                            <div className='job-start'>Llegada: {getUTCTimeFromMillis(j.start)}</div>
                                            <div className='job-title'>{j.title}</div>
                                            <div>Duración: {getDisplayDuration(j.duration)}</div>
                                            <div className='job-end'>Finalizacion: {getUTCTimeFromMillis(j.end)}</div>
                                        </div>
                                    </div>
                                    )
                                })}

                                <div className='depot'>
                                    <div className='depot-draw'>
                                        <div className='depot-line'></div>
                                        <div className='depot-icon'></div>
                                    </div>
                                    <div className='end-depot-info'>
                                        Depósito: {selectedRoute!==null && selectedRoute.depot.name}
                                    </div>
                                </div>
                                { (selectedRoute!==null) && 
                                <div  className='end'>
                                    Fin: {getUTCTimeFromMillis(selectedRoute.workEndDateTime)}
                                </div>
                                }
                            </div>

                        </div>

                    </div>
                </div>
                <div className='planning-map'>
                    <div className='map' id='map'>
                        
                    </div>
                </div>
            </div>
        </div>
        </>
    )

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

    

}

export default Planificacion
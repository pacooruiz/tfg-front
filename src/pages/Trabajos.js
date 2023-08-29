import NavBar from '../components/NavBar'
import './styles/Trabajos.css'
import Job from '../components/Job'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import L from 'leaflet'
import markerImage from 'leaflet/src/images/marker.svg'
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch'
import AddJobForm from '../components/AddJobForm';

function ChangeMapView({ coordinates, zoom }) {
    const map = useMap();
    map.setView(coordinates, zoom);
    return null
}

const Search = (props) => {
    const map = useMap()
    const { provider } = props

    useEffect(() => {
        const searchControl = new GeoSearchControl({
            provider,
            showMarker: false
        })

        map.addControl(searchControl)
        return () => map.removeControl(searchControl)
    }, [props])

    return null
}



function Trabajos(){

    const [jobs, setJobs] = useState([])
    const [showJobsList, setShowJobsList] = useState(true)
    const [showAddJob, setShowAddJob] = useState(false)
    const [showEditJob, setShowEditJob] = useState(false)

    const lastClickedLocation = useRef({lat: null, lng: null})

    var marker = null;
    var map;

    function removeMarker(map, marker){
        if(marker !== null){
            map.removeLayer(marker)
        }
    }

    function GetCoordinatesByClick({showEditJob, showAddJob}){
        map = useMap()
        if(showJobsList !== true){
            map.on("click", function(e){
                removeMarker(map, marker)
                lastClickedLocation.current = {latitude: e.latlng.lat, longitude: e.latlng.lng}
                marker = L.marker([e.latlng.lat, e.latlng.lng]).setIcon(L.icon({
                    iconUrl: markerImage,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                }))
                marker.addTo(map)
                console.log(marker)
            })
        }
    }

    const [mapCenter, setMapCenter] = useState([37.891605,-4.7799])
    const [mapZoom, setMapZoom] = useState(13)

    useEffect(function(){
        axios.get('http://localhost:8080/jobs').then(res => 
        setJobs(res.data)
        )
    }, [])


    function addJob(job){
        job.id = uuidv4()
        job.duration = job.duration*60*1000
        job.location = {}
        job.location.latitude = lastClickedLocation.current.latitude
        job.location.longitude = lastClickedLocation.current.longitude       
        setJobs([...jobs, job])
    }

    function deleteJob(jobId){

        axios.delete('http://localhost:8080/jobs?id=' + jobId).then(res => {
            if(res.status === 200){
                setJobs(jobs.filter(j => j.id !== jobId))
                setMapCenter([37.891605,-4.7799])
                setMapZoom(13)
            }
        })
    }

    function editJob(job){
        selectJobInMap([job.location.latitude, job.location.longitude])
        setShowJobsList(false)
        setShowAddJob(false)
        setShowEditJob(true)
    }

    function selectJobInMap(coordinates){
        setMapZoom(25)
        setMapCenter(coordinates)
    }

    const markerIcon = L.icon({
        iconUrl: markerImage,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    function closeAddJobForm(){
        console.log(marker)
        removeMarker(map, marker)
        setShowJobsList(true)
        setShowAddJob(false)
        setShowEditJob(false)  
    }
    

    return(
        <div className='trabajos-page'>
            <NavBar></NavBar>
            <div className='trabajos-content'>

                

                <div className='trabajos'>

                    {showAddJob && <AddJobForm addFunction={addJob} closeAddJobForm={closeAddJobForm} lastClickedLocation={lastClickedLocation}/>}
                    {showEditJob && <div>Editar</div>}
                    {showJobsList &&
                    <>
                    <div className='trabajos-top'>
                        <h1>Trabajos ({jobs.length})</h1>
                        <div className="addButton" onClick={() => {setShowAddJob(true); setShowJobsList(false)}}>AÑADIR TRABAJO</div>
                    </div>
                    <hr/>
                    <div className='trabajos-list'>
                        {jobs.map((job) => {
                            return(
                                <Job job={job} deleteFunction={deleteJob} viewOnMap={selectJobInMap} editFunction={editJob}></Job>
                            )
                        })}
                    </div>
                    </>
                    }
                </div>
                <div className='map-div'>
                    <MapContainer center={mapCenter} zoom={mapZoom}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {jobs.map((job) => {
                            return(
                                <Marker
                                    position={[job.location.latitude, job.location.longitude]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <b>{job.title}</b>
                                    </Popup>

                                </Marker>

                        )})}

                        <ChangeMapView coordinates={mapCenter} zoom={mapZoom}/>
                        <Search provider={new OpenStreetMapProvider()} />
                        <GetCoordinatesByClick showAddJob={showAddJob} showEditJob={showEditJob}/>

                    </MapContainer>
                </div>
                
            </div>
            
        </div>
    );

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    
}

export default Trabajos
import NavBar from "../components/NavBar"
import { useState } from "react"
import '../pages/styles/Depositos.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch'
import DeleteModal from "../components/DeleteModal"
import { useEffect } from "react"
import axios from "axios"
import markerImage from 'leaflet/src/images/marker.svg'
import L from 'leaflet'
import { useRef } from "react"

function Depositos(){

    const lastClickedLocation = useRef({latitude: null, longitude: null})
    var marker = null;
    var map;

    function removeMarker(map, marker){
        if(marker !== null){
            map.removeLayer(marker)
        }
    }

    function GetCoordinatesByClick(){
        map = useMap()
        
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

    const markerIcon = L.icon({
        iconUrl: markerImage,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    useEffect(function(){
        axios.get('http://localhost:8080/depots').then(res => 
        setDepots(res.data)
        )
    }, [])

    const [mapCenter, setMapCenter] = useState([37.891605,-4.7799])
    const [mapZoom, setMapZoom] = useState(13)

    const [depots, setDepots] = useState([])

    function deleteDepot(depotId){
        axios.delete('http://localhost:8080/depots?id=' + depotId).then(res => {
            if(res.status === 200){
                setDepots(depots.filter(d => d.id !== depotId))
            }
        })
    }

    function addDepot(){

        const name = document.getElementById('name').value
        const latitude = lastClickedLocation.current.latitude
        const longitude = lastClickedLocation.current.longitude

        if(latitude===null || longitude===null){
            alert('Debe seleccionar una localización')
            return
        }

        console.log(lastClickedLocation.current)

        if(name === ''){
            alert('Debe añadir un nombre')
            return
        }

        var newDepot = {
            name: name,
            latitude: latitude,
            longitude: longitude
        }

        axios.post("http://localhost:8080/depots", newDepot)
        .then(res => {

            if(res.status === 200){
                window.location.reload()
            }            
        })
    }

    return(
        <>
        <NavBar></NavBar>
        <div className='content'>
            <div className="top">
                <h1>Depósitos ({depots.length})</h1>
                <div className="addButton" onClick={() => document.getElementById("add-depot").style.display = "table-row"}>AÑADIR DEPÓSITO</div>
            </div>
            <div className="depots-body">
                <div className="depots-table">
                <table className="workersTable">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th style={{textAlign: "center"}} className="actions-column-style">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="add-depot" style={{display:"none"}}>
                                <td>
                                    <input placeholder="Nombre" id="name"></input>Selecciona la localización en el mapa
                                </td>
                                <td>
                                    <div className="actions">                                        
                                        <div>
                                            <span className='editButton actionButton' onClick={() => {addDepot()}}>Añadir</span>
                                        </div> 
                                    </div>           
                                </td>
                            </tr>
                            {depots.map((d) => {
                                return(
                                <tr key={d.id}>
                                    <td>{d.name}</td>
                                    <td>
                                        <div className="actions">                                        
                                            <div>
                                                <DeleteModal message={"el depósito \"" + d.name + "\""} idToDelete={d.id} deleteFunction={deleteDepot}></DeleteModal>
                                            </div>
                                        </div>
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </table>

                </div>
                <div className='depots-map-div'>
                    <MapContainer center={mapCenter} zoom={mapZoom}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {depots.map((d) => {
                            return(
                                <Marker
                                    position={[d.latitude, d.longitude]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <b>{d.name}</b>
                                    </Popup>

                                </Marker>

                        )})}

                        <GetCoordinatesByClick/>

                    </MapContainer>
                </div>
            </div>
        </div>
        </>
    )

}

export default Depositos
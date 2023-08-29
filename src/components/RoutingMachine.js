import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
  console.log("Añadision")
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(props.depot.latitude, props.depot.longitude),


      L.latLng(37.553212, -4.355143),
      L.latLng(37.885932, -4.789848),

      L.latLng(props.depot.latitude, props.depot.longitude)
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: true,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;

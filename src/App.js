import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Vehiculos from "./pages/Vehiculos";
import Rutas from './pages/Rutas';
import Trabajos from './pages/Trabajos';
import Trabajadores from './pages/Trabajadores';
import Planificacion from './pages/Planificacion';
import Login from './pages/Login';
import Depositos from './pages/Depositos';

function App() { 

  

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route index Component={Login}></Route>
        <Route exact path="/vehiculos" Component={Vehiculos}></Route>
        <Route exact path="/planificaciones" Component={Rutas}></Route>
        <Route exact path="/trabajos" Component={Trabajos}></Route>
        <Route exact path="/trabajadores" Component={Trabajadores}></Route>
        <Route exact path="/planificacion/:id" Component={Planificacion}></Route>
        <Route exact path="/depositos" Component={Depositos}></Route> 
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;

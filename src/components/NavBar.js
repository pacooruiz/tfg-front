import './NavBar.css';

function NavBar(){

    return(
        <div className="top-bar">
        <ul>
          <a href='/planificaciones'>
            <li>Planificaciones</li>
          </a>
          <a href='/trabajos'>
            <li>Trabajos</li>
          </a>
          <a href='/vehiculos'>
            <li>Vehículos</li>
          </a>
          <a href='/trabajadores'>
            <li>Trabajadores</li>
          </a>
          <a href='/depositos'>
            <li>Depósitos</li>
          </a>
        </ul>
        <div className='user'>
          admin
          <div>
            <svg className='user-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
          </div>
        </div>
      </div>
    );
}

export default NavBar;
//import logo from './logo.svg';
import './App.css';

import { Map } from './components/Map';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
        <div className="map-container">
            <Map />
        </div>
    </div>
  );
}

export default App;

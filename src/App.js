import React, { useRef, useState } from "react";
import { Map, TileLayer, Marker, GeoJSON, Tooltip } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import pin from "./data.json";
import place from "./polygons.json";
import { Button } from "react-bootstrap";


const defaultZoom = 9;
// const khanapara = [28.3852, -81.5639];

let lat_avg = 0,
  Lng_avg = 0;
for (let i = 0; i < pin.length; i++) {
  lat_avg += pin[i].lat.valueOf() / pin.length;
  Lng_avg += pin[i].long.valueOf() / pin.length;
}

var centerLat = lat_avg;
var centerLong = Lng_avg;

const greenIcon = L.icon({
  iconUrl:
    "https://cdn.pixabay.com/photo/2012/04/26/19/04/map-42871_960_720.png",

  iconSize: [28, 26], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [8, 26], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -22] // point from which the popup should open relative to the iconAnchor
});

function App() {
  const mapRef = useRef();
  const collection = document.getElementsByClassName("polygons");
  const pop_data = [...collection];
  const [col, setCol] = useState(pop_data);

  /**
   * handleOnFlyTo
   */

  function handleOnFlyTo() {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;
      map.flyTo([26.1259, 91.8108], 14, {
        duration: 2
      });
  }

  const [val, setVal] = useState(2000);
  

  const handleClick = (year) => {
    for (let i = 0; i < pin.length; i++) {
      if (parseInt(pin[i].pop[val]) < parseInt(pin[i].pop[year])) {
        setCol("red");
      } else {
        setCol("green");
      }
    }
    console.log(pop_data[0].pathOptions) 
    setVal(year);
  };
  const pathOptions = { color: col };

  return (

    
    <div className="App">
      <div className="container ">
        <label className="form-label">
          Population Year
        </label>
        <input
          type="range"
          className="year"
          min="2000"
          max="2021"
          step="1"
          id="yearUp"
          onChange={() => handleClick(document.getElementById("yearUp").value)}
        />
        <span>{val}</span>

        <p>
          <Button className="btn mx-2" variant="secondary" onClick={handleOnFlyTo}>
            Khanapara
          </Button>
        </p>
      </div>

      <Map ref={mapRef} center={[centerLat, centerLong]} zoom={defaultZoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pin.map((place) => (
          <Marker
            position={[place.lat, place.long]}
            icon={greenIcon}
            key={place.id}
          >
            <Tooltip
              className="popups"
              permanent={true}
              direction="top"
              opacity={100}
              offset={[10, 10]}
            >
              {place.name} <br />
              <div className="pin_pop">Population: {place.pop[val]}</div>
            </Tooltip>
          </Marker>
        ))}
        <GeoJSON
          data={place}
          className="polygons"
          {...pathOptions}
        />
      </Map>
    </div>
  );
}

export default App;

import React, { useRef, useEffect} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 
mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0dmFsZW56dWVsYSIsImEiOiJja3FoaGhpdXoxYThuMnVudTh4bmg3YmExIn0.FN1QSshNPIdsMigLVCL3vw';
 
const MapboxC = (data) => {
const mapContainer = useRef(null);
const map = useRef(null);

 
useEffect(() => {
    // console.log('coordinates to plot', data.values);
    // console.log('second data', data.values[1]);
    // console.log('length data', data.values.length);
if (data.values.length === 0) {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-70.9, 42.35],
        zoom: 9
        }).addControl(new mapboxgl.NavigationControl(), "top-right");
        
}else{
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: data.values[0][0],
        zoom: 9
        }).addControl(new mapboxgl.NavigationControl(), "top-right");
for (let index = 0; index < data.values.length; index++) {
    new mapboxgl.Marker().setLngLat(data.values[index][0])
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `<h3 id="title-market-mapbox">`+data.values[index][1][0]+`</h3>
                <p id="title-market-mapbox"><b> Address: </b>`+data.values[index][1][1]+`</p>
                <p id="title-market-mapbox">
                <a href="https://www.google.com/maps/dir//`+data.values[index][0][1]+`,`+data.values[index][0][0]+`" target="_blank">Get Directions</a><br>
                <a href="tel:`+data.values[index][1][2]+`"> <i className="mdi mdi-phone"></i>Call</a>
                </p>`
            )).addTo(map.current);
    
}
            
}

});
 

 
return (
<div>
<div ref={mapContainer} className="map-container" />
</div>
);
}

export default MapboxC;
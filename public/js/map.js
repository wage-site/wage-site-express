mapboxgl.accessToken = 'pk.eyJ1IjoiZWR5Z3V5IiwiYSI6ImNrbDNoZzB0ZjA0anoydm13ejJ2ZnI1bTUifQ.IAGnqkUNAZULY6QbYCSS7w';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [25.045456,45.268469],
    zoom: 12
});

const sensor1 = document.createElement('div');
    sensor1.className='marker';

new mapboxgl.Marker(sensor1).setLngLat([25.048867,45.286398]).addTo(map);

const sensor2 = document.createElement('div');
    sensor2.className='marker';

new mapboxgl.Marker(sensor2).setLngLat([25.052028,45.280628]).addTo(map);

const sensor3 = document.createElement('div');
    sensor3.className='marker';

new mapboxgl.Marker(sensor3).setLngLat([25.048754,45.274820]).addTo(map);

const sensor4 = document.createElement('div');
    sensor4.className='marker';

new mapboxgl.Marker(sensor4).setLngLat([25.043894,45.272351]).addTo(map);

const sensor5 = document.createElement('div');
    sensor5.className='marker';

new mapboxgl.Marker(sensor5).setLngLat([25.049032,45.271199]).addTo(map);

const sensor6 = document.createElement('div');
    sensor6.className='marker';

new mapboxgl.Marker(sensor6).setLngLat([25.056741,45.278867]).addTo(map);

const sensor7 = document.createElement('div');
    sensor7.className='marker';

new mapboxgl.Marker(sensor7).setLngLat([25.061218,45.279651]).addTo(map);

const sensor8 = document.createElement('div');
    sensor8.className='marker';

new mapboxgl.Marker(sensor8).setLngLat([25.066074,45.299166]).addTo(map);

const sensor9 = document.createElement('div');
    sensor9.className='marker';

new mapboxgl.Marker(sensor9).setLngLat([25.040359,45.264673]).addTo(map);

const sensor10 = document.createElement('div');
    sensor10.className='marker';

new mapboxgl.Marker(sensor10).setLngLat([25.040671,45.265972]).addTo(map);

const sensor11 = document.createElement('div');
    sensor11.className='marker';

new mapboxgl.Marker(sensor11).setLngLat([25.013735,45.247687]).addTo(map);

const sensor12 = document.createElement('div');
    sensor12.className='marker';

new mapboxgl.Marker(sensor12).setLngLat([25.020026,45.233489]).addTo(map);

const sensor13 = document.createElement('div');
    sensor13.className='marker';

new mapboxgl.Marker(sensor13).setLngLat([25.010714,45.221211]).addTo(map);



                        /* sidetabs function */

function openMenu(evt, itemName) {
    var i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(itemName).style.display = "block";
    evt.currentTarget.className += " active";
    }
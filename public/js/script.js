//client
const socket = io("http://localhost:3000");
//const socket =io();

//console.log('hello');

socket.on('connect',function(){ 
    console.log('connected to the sever');
})

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const{latitude,longitude}=position.coords;
            console.log("from navigator" +latitude); //my location
            console.log("from navigator" +longitude);
            socket.emit("send-location", {latitude,longitude}); //send the location to the server
        },
        (error)=>{
            console.error(error);
        },
        {
            enableHighAccuracy:true,
            timeout:5000, //5 second
            maximumAge:0, //no saved data
        }
    )
}


// L.map('map').setView([0,0],10);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"Sohail"}).addTo(map)

// Initialize the map
const map = L.map('map').setView([0, 0], 10);

// Add tile layer with attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Sohail'  // Attribution text
}).addTo(map);

const markers={};

//id is not defined
// if(markers[id]){
//     markers[id].setLatLng([latitude,longitude])
// }
// else{
//     markers[id]=L.marker([latitude,longitude]).addTo(map);
// }


socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    //console.log(`Received location: ID - ${id}, Latitude - ${latitude}, Longitude - ${longitude}`);
    map.setView([latitude, longitude],15);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
    
    //console.log("from server" + latitude);
    //console.log("from server" + longitude);
    map.setView([latitude, longitude],15); // update the map view
});

socket.on("user-disconnected",(id)=>{ // deleting the marker of the user who is disconnected
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
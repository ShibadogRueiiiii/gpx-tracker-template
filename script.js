let map=L.map('map').setView([23.7,121],7)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map)

let points=[]
let polyline

const fileInput=document.getElementById("gpxFile")

fileInput.addEventListener("change",function(){

const file=this.files[0]

const reader=new FileReader()

reader.onload=function(e){

const parser=new DOMParser()

const xml=parser.parseFromString(e.target.result,"text/xml")

const trkpts=xml.getElementsByTagName("trkpt")

points=[]

for(let i=0;i<trkpts.length;i++){

let lat=trkpts[i].getAttribute("lat")
let lon=trkpts[i].getAttribute("lon")

points.push([parseFloat(lat),parseFloat(lon)])

}

drawMap()
saveData()

}

reader.readAsText(file)

})

function drawMap(){

if(polyline) map.removeLayer(polyline)

points.forEach(p=>{
L.circleMarker(p).addTo(map)
})

polyline=L.polyline(points,{color:"red"}).addTo(map)

map.fitBounds(polyline.getBounds())

updateList()

}

function updateList(){

const list=document.getElementById("gpsList")

list.innerHTML=""

points.forEach((p,i)=>{

const li=document.createElement("li")

li.textContent=i+" : "+p[0]+","+p[1]

list.appendChild(li)

})

}

function saveData(){

localStorage.setItem("gpsPoints",JSON.stringify(points))

}

function loadData(){

const data=localStorage.getItem("gpsPoints")

if(data){

points=JSON.parse(data)

drawMap()

}

}

loadData()

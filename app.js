//Server

const express =require("express");
const http=require("http");
const socketio=require("socket.io")


const app=express();
const server =http.createServer(app)
const io=socketio(server);
const path =require("path");




app.set("view engine","ejs")
//app.use(express.static("public")); //app.use
//app.set('views', path.join(__dirname, 'views')); //app.use
app.use(express.static(path.join(__dirname,"public"))); //app.use


io.on("connection",function(socket){
    //console.log("connected");

    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data});
    })

    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    })
        
})


// app.get('/', async (req, res) => {
//     try {
//       const data = await someAsyncFunction();
//       res.send(data);
//     } catch (error) {
//         console.error('Error details:', error.stack);
//         res.status(500).send("Internal Server Error");
//     }
//   });

app.get('/', function (req, res) {
    res.render('index');  // Ensure that the "index.ejs" file exists in the views folder
});

// console.log('Views directory:', app.get('views'));  

// server.listen(3000)
server.listen(3000, () => {
    //console.log('Server is running on port 3000');
});

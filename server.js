var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var mysql = require("mysql");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
app.use(bodyParser.urlencoded({ extended: false }))

server.listen(8888);

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Asd123456@",
  database: "server_1"
});
  //Tao database
conn.connect(err => {
    if (err) throw err;
    console.log('Connected!');
});
conn.query("CREATE DATABASE IF NOT EXISTS server_1", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  conn.query("CREATE TABLE dang_ky (ID VARCHAR(255),PASS VARCHAR(255),JOY VARCHAR(255))", function () {
    console.log("table created");
  });
  // var sql = "DROP TABLE dang_ky";
  // conn.query(sql, function () {});

var players = {};
var mangusnames = {};
var mangUser = [];
var mangDevice = [];
var mang = [];
var mangroom = {};
io.on("connection" ,function(socket){
  var idConect = null;
  var mangtoados = [];
  mangusnames[socket.id] = [];
  var mangusname = mangusnames[socket.id] || [];
  console.log("co nguoi ket noi "+socket.id);
  //console.log("player ",players,"manguser ",mangUser,"mangtoado ",mangtoados);
  socket.once("disconnect", function() {
    console.log(socket.id+" disconnect");
    for (var id in players)
    for (var id in mangtoados)
    for (var id in mangusnames)
    for (var i =0; i < mangUser.length; i++){
      if(mangUser[i] == socket.id){
        mangUser.splice(i,1);
      }
    }
    for (var i =0; i < mangDevice.length; i++){
      if(mangDevice[i] == mangDevice.id){
        mangDevice.splice(i,1);
      }
    }
    delete players[id];
    delete mangtoados[id];
    delete mangusnames[id];
    //players.splice(players.indexOf(socket.id),1);
    io.sockets.emit("send-disconnect");
  });

    // Nhan ID va kiem tra database

  socket.on("send-id1",function(data){
    console.log(data);
    socket.Us = data.id;
    var sql_query = "SELECT * FROM dang_ky WHERE ID = ('"+data.id+"')";
    console.log(sql_query);
    conn.query(sql_query,function(err, result) {
     if(err) throw err;
     console.log(result);

     if (result.length == 0) {
       console.log("ko co");
      conn.query("INSERT INTO dang_ky (ID,PASS,JOY) VALUES ('"+data.id+"','"+data.pass+"','"+data.joy+"')",function(){
         console.log("1 record inserted");
       });
       socket.emit("dangkithanhcong");
     }
     if (result.length > 0) {
       console.log("ton tai");
       socket.emit("ton-tai");
     }
    });
   });

  socket.on("send-id",function(data){
     console.log(data);
     var sql_query = "SELECT * FROM dang_ky WHERE ID = '"+data.id+"'";
     console.log(sql_query);
     conn.query(sql_query,function(err, result) {
      if(err) throw err;

      if (result.length == 0) {
        console.log("ko co");
        socket.emit("erro",function(){});
      }
      if (result.length > 0) {
        console.log("ton tai");
        console.log(result);
        console.log(result[0].PASS);
        console.log(result[0].JOY);
          if(result[0].PASS==data.pass){
          // mangUser.push(socket.id);

          socket.emit("star-game");
          socket.Us = data.id;
          mangusname.push(data.id);
          mangUser.push({user:socket.Us,id:socket.id,jt:result[0].JOY})
          console.log(mangUser);
          console.log(mangusnames);
          console.log("US: "+socket.Us);
          }
          else {
            socket.emit("error-pass");
          }
      }
     });
    });

  socket.on("device",function(data){
    for (var i = 0; i < mangUser.length; i++) {
      if (mangUser[i].jt == data.deviceName ) {
        idConect = mangUser[i].id;
        console.log(idConect);
        socket.to(idConect).emit("idDevice",socket.id);
      }
    }
  });

  socket.on("idDevice",function(data){
    idConect = data;
    console.log("idDevice "+data);
  });

  socket.on("Play-all",function(data){
    var flag1 = 0;
    for (var i = 0; i < mang.length; i++) {
      if(mang[i] == data.id){
        io.sockets.in(data.id).emit("Play-all1");
        flag1 = 1;
      }
    }
    if(flag1 == 0)
    socket.emit("");
  });

  socket.on("send-id2",function(data){
    var flag1 = 0;
    for (var i = 0; i < mang.length; i++) {
      if(mang[i].room == data.id) {
        socket.join(data.id);
        socket.Phong=data.id;
        socket.emit("join-room");
        io.to(data.id).emit("join",{id:(data.id),sock:(socket.Us),sock1:(mang[i].host)});
        //socket.emit("join",{id:(data.id),sock:(socket.Us)});

        flag1 = 1;
      }
    }
    if(flag1 == 0){
        socket.emit("join-fail");
    }
  });

  socket.on("send-id3",function(data){
      socket.join(data.id);
      socket.Phong = data.id;

      var flag0 = 0;
      for (var i = 0; i < mang.length; i++) {
        if(mang[i].room == data.id){
          socket.emit("room-ton-tai");
          flag0 = 1;
        }
      }
      if(flag0 == 0){
          mang.push({ room: data.id, host: socket.Us });
          socket.emit("tao-room");

          io.sockets.in(data.id).emit("dataname",{id:(data.id),sock:(socket.Us)});
          //socket.emit("dataname",{id:(data.id),sock:(socket.Us)});
      }
      console.log("mang "+mang);
      //console.log(socket.adapter.rooms);

    });

  socket.on("Play-all",function(data){
    io.to(data.id).emit("Play-all1");
  });

  socket.on("controlDevice",function(data){
    socket.to(idConect).emit("controlDevice",data);
  });

  socket.on("chose",function(){
    console.log(socket.id+"chose");
    socket.to(socket.Phong).emit("chose1");
  });

  socket.on("movement-left",function(data) {
    //console.log(data);
    //console.log(socket.id+ ' start');
    console.log(mangtoados);
    var player = { x: data.x, y: data.y }
      if (data.control.left) {
      if(player.x==5){
        player.x += 320;
      }
      else
      player.x -= 80;
    }
    if (data.control.up) {
      if(player.y==5){
        player.y += 560;
      }
      else
      player.y -= 80;
    }
    if (data.control.right) {
      if(player.x==325){
        player.x -=320;
      }
      else
      player.x += 80;
    }
    if (data.control.down) {
      if(player.y==565){
        player.y -= 560;
      }
      else
      player.y += 80;
    }
    if(data.control.space){
      var tonTai = 0;
      for(var i=0; i < mangtoados.length; i+=2){
        if(mangtoados[i]==player.x && mangtoados[i+1]==player.y){
          console.log("ton tai: " + player.x + "," + player.y);
          mangtoados.splice(i,2);
          socket.emit("delete",player);
          tonTai = 1;
          break;
        }
      }
      if (tonTai == 0 && mangtoados.length != 16) {
        mangtoados.push(player.x,player.y);
        //console.log(mangtoado);
      }
    }
    if(data.control.chose){
      console.log(socket.id+" "+socket.Phong);
      io.to(socket.Phong).emit("block");
      console.log(socket.id+" enter");
      return ;
    }
      socket.emit('state', player);
      socket.emit('pick',mangtoados);
    });

  socket.on("movement-right",function(data) {
      //console.log(data);
      //console.log(socket.id+ ' start');
      console.log(mangtoados);
      var player = { x: data.x, y: data.y }
        if (data.control.left) {
        if(player.x==485){
          player.x += 320;
        }
        else
        player.x -= 80;
      }
      if (data.control.up) {
        if(player.y==5){
          player.y += 560;
        }
        else
        player.y -= 80;
      }
      if (data.control.right) {
        if(player.x==805){
          player.x -=320;
        }
        else
        player.x += 80;
      }
      if (data.control.down) {
        if(player.y==565){
          player.y -= 560;
        }
        else
        player.y += 80;
      }
      if(data.control.space){
        socket.to(socket.Phong).emit("check",player);
      }
        socket.emit('state', player);
        //socket.emit('pick',mangtoados);
      });

  socket.on("check",function(data){
    //socket.emit("fire-delete");
    //console.log(data.x-480,data.y);
    //socket.emit("pick",mangtoados);
     var tonTai = 0;
     for(var i=0; i < mangtoados.length; i+=2){
       if(mangtoados[i]==(data.x-480) && mangtoados[i+1]==data.y){
         mangtoados.splice(i,2);
         // socket.to(idConect).emit("buzzer",{result: 'hit'});
         // console.log(idConect);
         socket.emit("pick",mangtoados);
         tonTai = 1;
         break;
       }
     }
     var soldier = mangtoados.length/2;
     socket.to(socket.Phong).emit("soldier",soldier);
     socket.emit("turn");
     socket.to(socket.Phong).emit("turn1");
     if(mangtoados.length == 0){
       socket.emit("lose");
       socket.to(socket.Phong).emit("win");
     }
  });
});

app.get("/",function(req,res){
  res.render("trangchu");
});


var socket=io('http://159.65.14.146:8888')
// socket.connect("http://localhost:8888")
var block = 0;
var numberChose=0;
var role= null;
var turn = false;
socket.on("dataname",function(data){
  $("#selRoom1").append(`<div class="titulo"> ${data.sock}</div>`);
  $("#selRoom").html = '';
  $("#selRoom").append(`<div class="titulo">ROOM NAME: ${data.id}</div>`);
  $("#selRoom").append(`<div class="titulo"> ${data.sock}</div>`);
});
socket.on("join",function(data){
   console.log(data);
   $("#selRoom").append(`<div class="titulo"> ${data.sock}</div>`);
   $("#selRoom1").html = '';
   $("#selRoom1").append(`<div class="titulo">ROOM NAME: ${data.id} </div>`);
   $("#selRoom1").append(`<div class="titulo"> ${data.sock}</div>`);
   $("#selRoom1").append(`<div class="titulo"> ${data.sock1}</div>`);
});
socket.on("soldier",function(data){
  document.getElementById("infoHostArmy").innerHTML = (`<div class=""> ${data}</div>`);
});
socket.on("join-fail",function(){
  alert("Phong khong ton tai");
});
socket.on("erro",function(){
  alert("Tai khoan khong ton tai");
});
socket.on("room-ton-tai",function(){
  alert("Ten phong da ton tai");
});
socket.on("tao-room",function(){
  alert("Tao room thanh cong");
  role = 'host';
  console.log(role);
  $("#roomname").show();
  $("#roomacc").hide();
  $("#creatroomform").hide();
  $("#registerform").hide();
  $("#howtoplayform").hide();
});
socket.on("Play-all1",function(){
  $("#trangchu").hide();
  canvas1.style.display='block';
  $("#Panel").show();
});
socket.on("join-room",function(){
  role = 'member';
  console.log(role);
  $("#roomname").hide();
  $("#roomacc").show();
  $("#creatroomform").hide();
  $("#registerform").hide();
  $("#howtoplayform").hide();
})
socket.on("dangkithanhcong",function(){
  alert("Dang ki thanh cong");
  $("#loginform").show();
  $("#registerform").hide();
  $("#howtoplayform").hide();
});
socket.on("star-game",function(){
  alert("Dang nhap thanh cong");
  $("#loginform").hide();
  $("#creatroomform").show();
  $("#registerform").hide();
  $("#howtoplayform").hide();
  canvas1.style.display='none';
    //canvas1.style.display='block';
    //window.location.href="../ANuc140Game/star";
});
socket.on("ton-tai",function(){
  alert("user ton tai")
});
socket.on("error-pass",function(){
  alert("sai password");
});
socket.on("block",function(){
  numberChose += 1;
  console.log("chose "+ numberChose);
  if(numberChose == 2){
    if(role == 'host'){
      turn = true;
    }
    block = 1;
    xx = 485;
    yy = 5;

  }
  console.log(turn+" "+block);
});
socket.on("check",function(data){
  socket.emit("check",data);
  turn = true;
});
socket.on("idDevice",function(data){
  console.log("Device "+data);
  socket.emit("idDevice",data);
});
socket.on("controlDevice",function(data){
  Keys.up=false;
  Keys.down=false;
  Keys.left=false;
  Keys.right=false;
  Keys.space=false;
  if(data.control == 2){
    Keys.up = true;
  }
  if(data.control == 4){
    Keys.left = true;
  }
  if(data.control == 6){
    Keys.right = true;
  }
  if(data.control == 8){
    Keys.down = true;
  }
  if(data.control == 'c'){
    Keys.space = true;
  }

  if(block == 0){
    socket.emit("movement-left",{ control: Keys, x: xx, y: yy });
  }
  if (block == 1 && turn == true) {
    socket.emit("movement-right",{ control: Keys, x: xx, y: yy });
    if(data.control == 'c'){
      //Keys.space = true;
      turn = false;
    }
  }
});
socket.on("lose",function(){
  $("#trangchu").show();
  $("#scoreform").show();
  $("#scoreform1").hide();
  $("#creatroomform").hide();
  $("#Panel").hide();
  $("#roomname").hide();
  $("#roomacc").hide();
  $("#registerform").hide();
  $("#howtoplayform").hide();
  canvas1.style.display='none';
});
socket.on("win",function(){
  $("#trangchu").show();
  $("#scoreform1").show();
  $("#scoreform").hide();
  $("#creatroomform").hide();
  $("#Panel").hide();
  $("#roomname").hide();
  $("#roomacc").hide();
  $("#registerform").hide();
  $("#howtoplayform").hide();
  canvas1.style.display='none';
});
socket.on("turn",function(){
  document.getElementById("TURN").innerHTML = (`<div class=""> YOUR TURN </div>`);
});
socket.on("turn1",function(){
  document.getElementById("TURN").innerHTML = (`<div class=""> NULL </div>`);
});
$(document).ready(function(){
  // nhan tin hieu tu ban phim
  document.addEventListener('keydown', function(event) {
    keydown(event);
    if (isPress) {
      if(block == 0){
        socket.emit("movement-left",{ control: Keys, x: xx, y: yy });
      }
      if (block == 1 && turn == true) {
        socket.emit("movement-right",{ control: Keys, x: xx, y: yy });
        if(Keys.space){
          turn = false;
        }
      }
    }
    document.addEventListener('keyup', function(event) {
      keyup(event);
    });
  });

  $("#loginform").show();
  $("#creatroomform").hide();
  $("#scoreform").hide();
  $("#scoreform1").hide();
  $("#Panel").hide();
  $("#roomname").hide();
  $("#roomacc").hide();
  $("#registerform").hide();
  $("#howtoplayform").hide();
  canvas1.style.display='none';
  $(".enviar").click(function(){
    //alert("click");
    socket.emit("send-id",{id:$("#id").val(),pass:$("#passwords").val()});
   });
  $(".dangki").click(function(){
    socket.emit("send-id1",{id:$("#id1").val(),pass:$("#passwords1").val(),joy:$("#joy").val()});
    // socket.emit("send-passwords1",$("#passwords1").val());
  });
  $(".col0").click(function(){
    $("#howtoplayform").show();
    $("#loginform").hide();
    $("#registerform").hide();
  });
  $(".col").click(function(){
    $("#loginform").hide();
    $("#registerform").show();
    $("#howtoplayform").hide();
  });
  $(".col1").click(function(){
    $("#loginform").show();
    $("#registerform").hide();
    $("#howtoplayform").hide();
  });
  $(".play").click(function(){
    $("#loginform").show();
    $("#registerform").hide();
    $("#howtoplayform").hide();
  });
  $(".creatroom").click(function(){
      socket.emit("send-id3",{id:$("#id3").val()});
    });
  $(".join").click(function(){
    socket.emit("send-id2",{id:$("#id2").val()});
  });
  $(".Play").click(function(){
    socket.emit("Play-all",{id:$("#id3").val()});
  });
});

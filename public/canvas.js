var canvas = document.querySelector('canvas');
//var socket=io('http://localhost:8888');

var canvas1 = document.getElementById('canvas1')
canvas1.height=640;
canvas1.width=1000;
var context = canvas1.getContext('2d');
console.log(canvas);
var gd = new giaodien();
var player, mang,mang1,mang2, xx = 5, yy = 5, cdmang,cdmang1,cdmang2;

var isPress = false;

img = new Image();
img1 = new Image();
imgdelete = new Image();
imgboom1 = new Image();
imgboom2 = new Image();
imgboom3 = new Image();
imgboom4 = new Image();
imgboom5 = new Image();
imgboom6 = new Image();
imgboom7 = new Image();
imgboom8 = new Image();
img1.src='/image/im2.png';
imgdelete.src=`/image/delete1.png`;
imgboom1.src = '/image/bug1.1.png';
imgboom2.src = '/image/bug1.2.png';
imgboom3.src = '/image/bug1.3.png';
imgboom4.src = '/image/bug1.4.png';
imgboom5.src = '/image/bug1.5.png';
imgboom6.src = '/image/bug1.6.png';
imgboom7.src = '/image/bug1.7.png';
imgboom8.src = '/image/bug1.8.png';


    socket.on("state",function(data){
      xx = data.x;
      yy = data.y;
     });
     socket.on("pick",function(data){
       console.log(data);
       mang = data;
       cdmang = data.length;
     });
     socket.on("pick-delete",function(data){
       mang1 = data;
       cdmang1 = data.length;
     });
     socket.on("pick-check",function(data){
       console.log("check "+data);
       mang2 = data;
       cdmang2 = data.length;
     });
     socket.on("delete",function(data){
       for(var id in data){
         var delete_player = data[id];
       }
     });

     setInterval(function() {
       clear();
       draw(context,xx,yy);
       for(var i=0;i<cdmang;i+=2){
         gd.draw_ship(img1,context,mang[i],mang[i+1]);
       }
       for (var i = 0; i < cdmang1; i+=2) {
         gd.draw_delete(imgboom4,context,mang1[i],mang1[i+1]);
       }
       for (var i = 0; i < cdmang2; i+=2) {
         gd.draw_check(imgdelete,context,mang2[i],mang2[i+1]);
       }
       //animate();
       //animate_boom();
     },100);
    function draw(a,b,c){
      gd.draw_hv(a,b,c);
    }
    function clear (){
        context.clearRect(0,0,1000,1000);
    }

var x = -500;
var y = 50;
var dx = 6;
function animate(){
  context.beginPath();
  img.src = '/image/may.png';
  context.drawImage(img,x,y);
  context.stroke();
   if( x > 1200){
     x = -500;
     y = (Math.random() * 100) +30;
     console.log(y);
   }
  x += dx;
}
var update = 1;
function animate_boom(){
  context.beginPath();
  context.drawImage(imgboom1,100,100);
  if(update == 2)
  context.drawImage(imgboom2,100,100);
  if(update == 3)
  context.drawImage(imgboom3,100,100);
  if(update == 4)
  context.drawImage(imgboom4,100,100);
  if(update == 5)
  context.drawImage(imgboom5,100,100);
  if(update == 6)
  context.drawImage(imgboom6,100,100);
  if(update == 7)
  context.drawImage(imgboom7,100,100);
  if(update == 8)
  context.drawImage(imgboom8,100,100);
  if(update == 8)
  update = 1;
  update +=1;
  context.stroke();
}

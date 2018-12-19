
var Keys = {
  up:false,
  down:false,
  left:false,
  right:false,
  space:false,
  chose:false
};
function keydown(event){
  isPress = false;

  switch (event.keyCode) {
    case 65: // LEFT_ARROW
      Keys.left= true;
      isPress = true;
      break;
    case 87: // UP_ARROW
      Keys.up = true;
      isPress = true;
      break;
    case 68: // RIGHT_ARROW
      Keys.right = true;
      isPress = true;
      break;
    case 83: // DOWN_ARROW
      Keys.down = true;
      isPress = true;
      break;
    case 32: //space
      Keys.space = true;
      isPress = true;
      break;
    case 13: //enter
      Keys.chose = true;
      isPress = true;
      break;
    }
}
function keyup(event){
  switch (event.keyCode) {
    case 65: // LEFT_ARROW
      Keys.left= false;
      break;
    case 87: // UP_ARROW
      Keys.up = false;
      break;
    case 68: // RIGHT_ARROW
      Keys.right = false;
      break;
    case 83: // DOWN_ARROW
      Keys.down = false;
      break;
    case 32: //space
      Keys.space = false;
      break;
    case 13: //enter
      Keys.chose = false;
      break;
    // case 81: //Q
    //   Keys.rotateleft = false;
    //   break;
    // case 69: //E
    //   Keys.rotateright = false;
    //   break;
    }
}

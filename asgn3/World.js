// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  //precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  //uniform mat4 u_GlobalScale;
  void main() {
    //gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position * u_GlobalScale;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {
   // gl_FragColor = u_FragColor;
   // gl_FragColor = vec4(v_UV, 1.0, 1.0);

    if (u_whichTexture == 2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == 1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); 
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); 
    } else {
     gl_FragColor = vec4(1, .2, .2, 1);
    }

  }`


let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let g_lastframe = 0;
let g_deltatime = 0;
let g_yaw = -90.0;
let g_pitch = 0.0;
let g_sensitivity = 0.1;
let g_fov = 60.0;
let g_moveSpeed = 2.0;
let camera = null;



var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1]
]

var g_map_2 = [
  [1, 1, 1, 2, 1, 4, 1, 1],
  [1, 0, 0, 1, 0, 1, 1, 1],
  [1, 2, 1, 2, 2, 1, 1, 1],
  [1, 0, 3, 3, 0, 5, 1, 7],
  [1, 2, 1, 0, 0, 1, 1, 6],
  [1, 2, 3, 0, 1, 4, 1, 7],
  [1, 2, 6, 1, 0, 3, 1, 6],
  [1, 3, 0, 1, 0, 1, 3, 5]
]

var g_currentMap = g_map_2;


function drawMap() {
  var box = new Cube();
  //for(i = 0; i < 2; ++i) {
    for (x = 0; x < 8; ++x){
      for(y = 0; y < 8; ++y){
        if(g_currentMap[x][y] == 1){
          //var box = new Cube();
          box.textureNum = 1;
          box.matrix.setTranslate(0,0,0);
          box.color = [0.6,1,0.6, 1];
          //box.matrix.translate(x-4, 0, y-4);
          box.matrix.translate(x, 0, y);
          box.render();
        }
      }
    }
 // }
}

g_map_full = [
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8],
]

function drawMap_h() {
  var box = new Cube();
  box.textureNum = 1;      
  box.color = [0.6,1,0.6, 1];
  
  for (x = 0; x < 8; ++x){
    for(y = 0; y < 8; ++y){
      if(g_currentMap[x][y] > 0){
        
        for(z = 0; z < g_currentMap[x][y]; ++z){
          //var box = new Cube();
          //box.textureNum = 1;      
          //box.color = [0.6,1,0.6, 1];
        
          box.matrix.setTranslate(0,0,0);
        
          box.matrix.translate(x, z, y);
        
          box.render();
        }
      }
    }
  }
}

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  
  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  //gl = canvas.getContext("webgl", {preserveDrawingBuffer: true, premultipliedAlpha: false, alpha: false });
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true });
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }

  gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.CULL_FACE);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) { 
    console.log('Failed to get sorage location of u_FragColor');
    return;
  }

  u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler0");
  if(!u_Sampler) {
    console.log("Failed to get storage loc of u_sampler");
    return false;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log('Failed to get storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log("failed to get storage location of u_GlobalRotateMatrix");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix){
    console.log("failed to get storage loc of u_projectionMatrix");
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix){
    console.log("failed to get loc of u_viewMatrix");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture"); 
  if (u_whichTexture < 0){
    console.log("failed to get loc of u_whichTexture");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (!a_UV){  
    console.log("error getting a_UV");
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);

  //gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);

 // u_GlobalScale = gl.getUniformLocation(gl.program, "u_GlobalScale");

}


g_global_dog_color = [154/255, 97/255, 26/255, 1];
g_inner_ear_color = [50/255,39/255,7/255,1];
//global body parts for rendering

g_jaw_angle = 0;
g_tail_angle = 0;
g_torso_angle = 0;
g_special_anim_offset = 0; //0.7

function initTextures(/*gl, n*/){

  var image = new Image();
  if (!image) {
    console.log("failed to create image object");
    return false;
  }

  image.onload = function() { sendTextureToGLSL(image);}

  image.src = 'sky.jpg';

  return true;
}

function sendTextureToGLSL(image) {
  var texture = gl.createTexture();
  if(!texture){
    console.log("failed to create texure object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler, 0);

  console.log("finished loading texture");
}

//globals for testing
var g_eye = new Float32Array([0,0,2]);
var g_at = [0,0,-1];
var g_up = [0,1,0];

function renderScene(){

  var startTime = performance.now();
  //var identityM = new Matrix4();
  //console.log("identity? ", identityM.elements);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.clear(gl.COLOR_BUFFER_BIT);

  var projMat = new Matrix4();
  //projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 1000);
  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
  var veiwMat = new Matrix4();
  /*
  console.log("cam at", camera.at);
  console.log("cam up", camera.up);
  console.log("g_eye", g_eye);
  var camEye = camera.eye.elements;
  var camAt = camera.at.elements;
  */
  //var camUp = camera.up.elements;
  //console.log("cameye", camEye);
  //veiwMat.setLookAt(camEye[0], camEye[1], camEye[2], camAt[0], camAt[1], camAt[2], camUp[0], camUp[1], camUp[2]);
  //veiwMat.setLookAt(g_eye[0],         g_eye[1],     g_eye[2],       g_at[0],      g_at[1],      g_at[2],      g_up[0],      g_up[1],      g_up[2]);
  //veiwMat.setLookAt(0,0,-1, 0,0,0, 0,1,0);
  //console.log("veiwmat", veiwMat.elements);
  //console.log("cam eye", camera.eye);

  //console.log("camera viewmat", camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
  //gl.uniformMatrix4fv(u_ViewMatrix, false, veiwMat.elements);


  var globalRotMatrix = new Matrix4().rotate(g_globalAngle, 1, 1, 1);
  //var global_scale_mat = new Matrix4().scale(0.6,0.6,0.6);
  //var global_scale_mat = new Matrix4().scale(0.6,0.6,0.6);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);
  //gl.uniformMatrix4fv(u_GlobalScale, false, global_scale_mat.elements);

  skybox = new Cube();

  skybox.matrix.scale(70,70,70);

  //skybox.render();

  plane = new Cube();

  plane.matrix.translate(0,-0.5,0);
  plane.matrix.scale(12.5,0.2,12.5);
  plane.textureNum = 1;
  plane.render();

  
  origin = new Cube();
  origin.color = [0.5,0.5,0.5,1];
  origin.textureNum = 2;
  //origin.matrix.scale(50,50,50);
  origin.matrix.scale(0.5,0.5,0.5);
  //origin.matrix.translate(0,0.5,0);
  //origin.renderFast();
  origin.render();
  
  //drawMap();
  drawMap_h();
  
  var duration = performance.now() - startTime;

  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");


}
/*
function drawCube(){

  cube = new Cube();

  cube.color = [1,1,1,1];

  cube.renderFast();
  //cube.render();
}
*/
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;



function tick() {
  
  g_seconds = performance.now()/1000.0-g_startTime;

  g_deltatime = performance.now() - g_lastframe;
  g_lastframe = performance.now();
  //console.log(g_seconds);
//console.log(g_special_animate);
  updateAnimationAngles();
  renderScene();

  //requestAnimationFrame(tick);
}



function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get" + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

let g_angle = 0;
let g_globalAngle = 30;
//let g_jaw_angle = 0;
let g_joint_animate = false;
let g_special_animate = false;
let g_global_x_translate = 0;
let g_global_y_translate = 0;
let g_global_z_translate = 0;


function addActionsFromHtmlUI() {

  //-------buttons-------
  //clear
  //animation buttons
  //document.getElementById('animate_on').onclick = function() {g_joint_animate = true; };
  document.getElementById('animate_off').onclick = function() {g_joint_animate = false; };

  //-------sliders-------
  //angle slider
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); sendTextToHTML(g_globalAngle + " degrees", "cam_angle");});

  //joint angle sliders
  //document.getElementById('joint_rot').addEventListener('mousemove', function() { g_jaw_angle = this.value; renderScene(); sendTextToHTML(g_jaw_angle + "degrees", "joint_angle");});
  //document.getElementById('tail_rot').addEventListener('mousemove', function() { g_tail_angle = this.value; renderScene(); sendTextToHTML(g_tail_angle + "degrees", "tail_angle");});
  
}

function main() {
  

  setupWebGL();
  connectVariablesToGLSL();

  
  //event handler for html ui actions
  addActionsFromHtmlUI();
  //console.log(g_special_animate);

  initTextures();
  canvas.onmousedown = shift_click;
  
  //document.onkeydown = keydown;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  
  camera = new Camera(g_fov, canvas.width/canvas.height, 0.1, 100);
  //camera.updateCameraVecs();
  document.onkeydown = camMove;
  //document.onmousemove = camTurn;
  //requestAnimationFrame(tick);
  //renderScene();
  //drawMap_h();
  
}

function camMove(ev){
  camera.handleMove(ev.keyCode);
  renderScene();
}

function camTurn(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);
  camera.handleMouseTurn(x,y);
  renderScene();
}

function shift_click(ev) {
  if (ev.shiftKey) {
    g_special_animate = !g_special_animate;
    console.log("shift click");
    //console.log(g_special_animate);
  }
  //console.log("clicked");
}


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();


  console.log("coords", x, y);
  
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
  return ([x,y]);
}


//37 -> left arrow
//38 -> up arrow
//39 -> right arrow
//40 -> down arrow

//87 -> W
//65 -> A
//83 -> S
//68 -> D

//81 -> Q
//69 -> E

//32 -> space
//67 -> C
/*
function keydown(ev){
  if (ev.keyCode == 68){ //right arrow
    g_eye[0] += 0.2;
  } else if (ev.keyCode == 65){
    g_eye[0] -= 0.2;
  } 
  if (ev.keyCode == 32) {
    g_eye[1] += 0.2;
  } else if (ev.keyCode == 67) {
    g_eye[1] -= 0.2;
  }
  if (ev.keyCode == 87) {
    g_eye[2] -= 0.2;
  } else if (ev.keyCode == 83) {
    g_eye[2] += 0.2;
  }

  if (ev.keyCode == 37) {
    g_at[0] += 4;
  } else if (ev.keyCode == 39) {
    g_at[0] -= 4;
  }
  if (ev.keyCode == 38) {
    g_at[1] += 4;
  } else if (ev.keyCode == 40) {
    g_at[1] -= 4;
  }

  renderScene();

  console.log(ev.keyCode);

}


function updateAnimationAngles() {
  if (g_joint_animate) {
    g_jaw_angle = -15*Math.sin(g_seconds*2)-10;
    g_tail_angle = 20*Math.sin(g_seconds*1.4);

    
  }
  if (g_special_animate && g_joint_animate) {
    g_jaw_angle = -15*Math.sin(g_seconds*1.7)-10;
    g_torso_angle = 20*Math.sin(g_seconds*1.5) + 180;
    g_tail_angle = 20*Math.sin(g_seconds*1.8); 
    g_special_anim_offset = 0.7;
    
  } else {
    g_special_anim_offset = 0;
    g_torso_angle = 0;
    
  }
  */
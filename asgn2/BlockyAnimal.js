// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_GlobalScale;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position * u_GlobalScale;
    
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    //gl_FragColor.rgb *= gl_FragColor.a;
  }`


let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;



//var g_points = []; // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = []; //array to store shape sizes 

var g_shapesList = [];

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
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
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
/*
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get storage location of u_Size');
    return;
  }
*/
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log('Failed to get storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log("failed to get storage location of u_GlobalRotateMatrix");
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  u_GlobalScale = gl.getUniformLocation(gl.program, "u_GlobalScale");

}


//g_global_leg_x_scale = 0;
//g_global_leg_y_scale = 0;
//g_global_leg_z_scale = 0;
g_global_dog_color = [154/255, 97/255, 26/255, 1];
g_inner_ear_color = [50/255,39/255,7/255,1];
//global body parts for rendering

g_jaw_angle = 0;
g_tail_angle = 0;
g_torso_angle = 0;
g_special_anim_offset = 0; //0.7

function renderScene(){
  

  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var globalRotMatrix = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  //var global_scale_mat = new Matrix4().scale(0.6,0.6,0.6);
  var global_scale_mat = new Matrix4().scale(0.6,0.6,0.6);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);
  gl.uniformMatrix4fv(u_GlobalScale, false, global_scale_mat.elements);

/*
  var body = new Cube();
  body.color = [1.0,1.0,0.0,1.0];
  body.matrix.translate(0.8, -0.4, .6);
  body.matrix.rotate(90, 0, 0, 1);
  body.matrix.rotate(45, 1, 0,1);
  body.matrix.scale(0.5, 1, 0.5);
  //body.render();

  var leftArm = new Cube();

  leftArm.color = [1.0, 0.0, 1.0,1.0];
  leftArm.matrix.translate(0, 0.2, 0.0);
  leftArm.matrix.rotate(g_jaw_angle, 0, 0, 1);
  var intermediate_joint_coord= new Matrix4(leftArm.matrix);
  leftArm.matrix.rotate(45, 0, 0,1);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.render();

  var box = new Cube();
  box.color = [1,.7,0.6,1];
  box.matrix = intermediate_joint_coord;
  box.matrix.translate(0,0.7,0);
  box.matrix.rotate(0,1,0,0);
  box.matrix.scale(.3,.3,.3);
  box.render();
*/
//front right leg and foot
//pink
//0.4, 0.9, 0.5 
//0.196

var torso = new Cube();
//torso.color = [.9, .9, .8, 1];
torso.color = g_global_dog_color;
torso.matrix.rotate(g_torso_angle, 0, 0, 1);
torso.matrix.translate(-0.35,0,-0.66); //-0.35, 0, -0.45
//parents for each part attaching to the main body
body_head_parent = new Matrix4(torso.matrix);
front_right_leg_parent = new Matrix4(torso.matrix);
front_left_leg_parent = new Matrix4(torso.matrix);
back_right_leg_parent = new Matrix4(torso.matrix);
back_left_leg_parent = new Matrix4(torso.matrix);
tail_parent = new Matrix4(torso.matrix);
torso.matrix.scale(0.7,0.6,1.4);
torso.render();

var head = new Cube();
//head.color = [0.3,0.55,0.78, 1];
head.color = g_global_dog_color;
head.matrix = body_head_parent;
head.matrix.translate(0.02, 0, -0.2);
jaw_bottom_parent = new Matrix4(head.matrix);
jaw_top_parent = new Matrix4(head.matrix);
left_ear_parent = new Matrix4(head.matrix);
right_ear_parent = new Matrix4(head.matrix);
right_cornea_parent = new Matrix4(head.matrix);
left_cornea_parent = new Matrix4(head.matrix);
head.matrix.scale(0.65,0.55,0.4);
head.render();

var right_cornea = new Cube();
right_cornea.color = [1,1,1,1];
right_cornea.matrix = right_cornea_parent;
right_cornea.matrix.translate(0.47,0.3,-0.02);
right_cornea.matrix.scale(0.13,0.13,0.05);
right_iris_parent = new Matrix4(right_cornea.matrix);
right_cornea.render();

var right_iris = new Cube();
right_iris.color = [0,0,0,1];
right_iris.matrix = right_iris_parent;
right_iris.matrix.translate(0.2, 0, -0.1);
right_iris.matrix.scale(0.5,0.8,1);
right_iris.render();

var left_cornea = new Cube();
left_cornea.color = [1,1,1,1];
left_cornea.matrix = left_cornea_parent;
left_cornea.matrix.translate(0.067,0.3,-0.02);
left_cornea.matrix.scale(0.13,0.13,0.05);
left_iris_parent = new Matrix4(left_cornea.matrix);
left_cornea.render();

var left_iris = new Cube();
left_iris.color = [0,0,0,1];
left_iris.matrix = left_iris_parent;
left_iris.matrix.translate(0.2, 0, -0.02);
left_iris.matrix.scale(0.5,0.8,1);
left_iris.render();

var jaw_top = new Cube();
//jaw_top.color = [1,1,0.5,1];
jaw_top.color = g_global_dog_color;
jaw_top.matrix = jaw_top_parent;
jaw_top.matrix.rotate(-2, 1, 0,0);
jaw_top.matrix.translate(0.145,0.1,-0.3);
jaw_top.matrix.scale(0.40012, 0.13, 0.5);
jaw_top.render();

var jaw_bottom = new Cube();
//jaw_bottom.color = [0.5,1,1,1];
jaw_bottom.color = g_global_dog_color;
jaw_bottom.matrix = jaw_bottom_parent;
jaw_bottom.matrix.rotate(-2, 1, 0,0);
jaw_bottom.matrix.translate(0.55,0.123,0.199);
//jaw_bottom.matrix.rotate(180, 1, 0, 0);
jaw_bottom.matrix.rotate(g_jaw_angle, 1, 0, 0);
jaw_bottom.matrix.scale(-0.3999, -0.13, -0.4999);
jaw_bottom.render();



var left_ear = new Cube();
//left_ear.color = [0.5, 0.5, 0.3, 1];
left_ear.color = g_global_dog_color;
left_ear.matrix = left_ear_parent;
left_ear.matrix.translate(0.06, 0.522, 0.065);
//left_ear.matrix.rotate(-g_jaw_angle, 0, 0, 1);
left_ear.matrix.rotate(12, 0, 0, 1);
left_ear.matrix.scale(0.15,0.19,0.12);
left_ear.render();

var left_inner_ear = new Cube();
left_inner_ear.color = g_inner_ear_color;
left_inner_ear.matrix = new Matrix4(left_ear.matrix);
left_inner_ear.matrix.scale(0.8,0.8,0.8);
left_inner_ear.matrix.translate(0.12,0,-0.1)
left_inner_ear.render();

var right_ear = new Cube();
//right_ear.color = [0.2,0.89, 0.13, 1];
right_ear.color = g_global_dog_color;
right_ear.matrix = right_ear_parent;
right_ear.matrix.translate(0.46, 0.55, 0.065);
right_ear.matrix.rotate(-12, 0, 0, 1);
right_ear.matrix.scale(0.15,0.19,0.12);
right_ear.render();


right_inner_ear = new Cube();

right_inner_ear.color = g_inner_ear_color;
right_inner_ear.matrix = new Matrix4(right_ear.matrix);
right_inner_ear.matrix.scale(0.8,0.8,0.8);
right_inner_ear.matrix.translate(0.1,0,-0.1)

right_inner_ear.render();


var front_right_leg = new Cube();

  //front_right_leg.color = [1,0.3,1,1];
  front_right_leg.color = g_global_dog_color;
  front_right_leg.matrix = front_right_leg_parent;
  //front_right_leg.matrix.rotate(-g_jaw_angle, 1, 0, 0);
  //front_right_leg.matrix.rotate(-35*Math.sin(g_seconds), 1, 0, 0);
  front_right_leg.matrix.translate(0.49, -0.65, 0.025);
  front_right_parent_coord = new Matrix4(front_right_leg.matrix);
  front_right_leg.matrix.scale(0.176, 0.86, 0.176);
  front_right_leg.render();

  var front_right_foot = new Cube();
  front_right_foot.matrix = front_right_parent_coord;
  //front_right_foot.color = [1, 0.6, 1, 1];
  front_right_foot.color = g_global_dog_color;
  front_right_foot.matrix.translate(-0.02, 0, -0.11);
  front_right_foot.matrix.scale(0.21,0.12,0.29);
  front_right_foot.render();
//front left leg and foot
//blue
  var front_left_leg = new Cube();
  //front_left_leg.color = [0.3, 1, 1, 1];
  front_left_leg.color = g_global_dog_color;
  front_left_leg.matrix = front_left_leg_parent;
  //front_left_leg.matrix.rotate(g_jaw_angle, 1, 0, 0);
  //front_left_leg.matrix.rotate(35*Math.sin(g_seconds), 1, 0, 0);
  front_left_leg.matrix.translate(0.07, -0.65, 0.025);
  front_left_parent_coord = new Matrix4(front_left_leg.matrix);
  front_left_leg.matrix.scale(0.176, 0.76, 0.176);
  front_left_leg.render();

  var front_left_foot = new Cube();
  //front_left_foot.color = [0.6, .9, .8, 1];
  front_left_foot.color = g_global_dog_color;
  front_left_foot.matrix = front_left_parent_coord;
  front_left_foot.matrix.translate(-0.01, 0, -0.11);
  front_left_foot.matrix.scale(0.21,0.12,0.29);
  front_left_foot.render();
//back right leg/foot
//orange 
var back_right_leg = new Cube();
  //back_right_leg.color = [.8, .7, 0.3,1];
  back_right_leg.color = g_global_dog_color;
  back_right_leg.matrix = back_right_leg_parent;
  back_right_leg.matrix.translate(0.49,-0.65, 1.2);
  //back_right_leg.matrix.translate(0.35,0,0.45); //-0.35, 0, -0.45
  //back_right_leg.matrix.rotate(-g_jaw_angle, 1, 0, 0);
  //back_right_leg.matrix.rotate(35*Math.sin(g_seconds), 1, 0, 0);
  //back_right_leg.matrix.translate(-0.35, 0, -0.45);
  back_right_parent_coord = new Matrix4(back_right_leg.matrix);
  back_right_leg.matrix.scale(0.176, 0.76, 0.176);
  back_right_leg.render();
  
  var back_right_foot = new Cube();
  //back_right_foot.color = [1, 1, 0.6 ,1];
  back_right_foot.color = g_global_dog_color;
  back_right_foot.matrix = back_right_parent_coord;
  back_right_foot.matrix.translate(-0.02, 0, -0.11);
  back_right_foot.matrix.scale(0.21,0.12,0.29);
  back_right_foot.render();

//back left leg/foot
//green  
var back_left_leg = new Cube();
  //back_left_leg.color = [0.6,1,0.6,1];
  back_left_leg.color = g_global_dog_color;
  back_left_leg.matrix = back_left_leg_parent;
  back_left_leg.matrix.translate(0.07, -0.65, 1.2);
  //back_left_leg.matrix.rotate(g_jaw_angle, 1, 0, 0);
  //back_left_leg.matrix.rotate(-35*Math.sin(g_seconds), 1, 0, 0);
  //back_left_leg.matrix.translate(0,0,0.2*Math.sin(g_seconds)-0.3);
  back_left_parent_coord = new Matrix4(back_left_leg.matrix);
  back_left_leg.matrix.scale(0.176, 0.76, 0.176); 
  back_left_leg.render();
  
  var back_left_foot = new Cube();
  //back_left_foot.color = [0.3,1,0.3,1];
  back_left_foot.color = g_global_dog_color;
  back_left_foot.matrix = back_left_parent_coord;
  back_left_foot.matrix.translate(-0.02,0,-0.11);
  back_left_foot.matrix.scale(0.21,0.12,0.29);
  back_left_foot.render();

  var tail = new Cube();
  //tail.color = [1,1,1,1];
  tail.color = g_global_dog_color;
  tail.matrix = tail_parent;
  tail.matrix.translate(0.23, 0.6, 1.4);
  tail.matrix.rotate(120, 1,0,0);
  tail.matrix.rotate(g_tail_angle, 0, 1, 1);
  tail.matrix.scale(0.25,1,0.2);
  tail.render();
  //tail.rotate
  /*
  test = new Cube();
  test.color = [1,1,1,1];
  test.matrix.scale(0.6,.6,.6);
  test.matrix.setRotate(-g_jaw_angle, 1, 0, 0);
  test.matrix.translate(0.5,0.4,0.3);
  //test.render();

  origin = new Cube();

  origin.color = [0,0,1,1];

  origin.matrix.scale(0.4,0.1,0.1);

  origin.render();
  */
  
  var duration = performance.now() - startTime;

  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");


}

function drawCube(){

  cube = new Cube();

  cube.color = [1,1,1,1];

  cube.render();

}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

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

    
  
}

function tick() {
  
  g_seconds = performance.now()/1000.0-g_startTime;

  console.log(g_seconds);
//console.log(g_special_animate);
  updateAnimationAngles();
  renderScene();

  requestAnimationFrame(tick);
}


function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get" + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

//constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Globals for UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
let g_numSegments = 10;
let g_rainbow = false;
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
  document.getElementById('animate_on').onclick = function() {g_joint_animate = true; };
  document.getElementById('animate_off').onclick = function() {g_joint_animate = false; };

  //-------sliders-------
  //angle slider
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); sendTextToHTML(g_globalAngle + " degrees", "cam_angle");});

  //joint angle sliders
  document.getElementById('joint_rot').addEventListener('mousemove', function() { g_jaw_angle = this.value; renderScene(); sendTextToHTML(g_jaw_angle + "degrees", "joint_angle");});
  document.getElementById('tail_rot').addEventListener('mousemove', function() { g_tail_angle = this.value; renderScene(); sendTextToHTML(g_tail_angle + "degrees", "tail_angle");});
  
}

function main() {
  

  setupWebGL();
  connectVariablesToGLSL();

  
  //event handler for html ui actions
  addActionsFromHtmlUI();
  //console.log(g_special_animate);
  canvas.onmousedown = shift_click;
  

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  requestAnimationFrame(tick);
 //   renderScene();

  
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


// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor.rgb *= gl_FragColor.a;
  }`

//drawing mode global variable
//1 = triangle
//2 = circle
//3 = square
let drawing_mode = 1;
//start on triangle as default
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
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get storage location of u_Size');
    return;
  }
}

function renderAllShapes(){
  
  gl.clear(gl.COLOR_BUFFER_BIT);

  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  //draw each shape in list
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
  /*
    var xy = g_shapesList[i].position;
    var rgba = g_shapesList[i].color;
    var size = g_shapesList[i].size;
    //var xy = g_points[i];
    //var rgba = g_colors[i];
    //var size = g_sizes[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //pass size
    gl.uniform1f(u_Size, size);

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  */
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;

  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

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
function addActionsFromHtmlUI() {

  //-------buttons-------
  //clear
  document.getElementById('clear').onclick = function() { clear_canvas_event(); };
  //draw object type
  document.getElementById('point').onclick = function() { g_selectedType = POINT};
  document.getElementById('triangle').onclick = function() { g_selectedType = TRIANGLE};
  document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE};
  //rainbow mode
  document.getElementById('rainbow').onclick = function() { g_rainbow = !g_rainbow};

  //-------sliders-------
  //color
  document.getElementById('red').addEventListener('mouseup', function() { g_selectedColor[0] = (this.value / 255)});
  document.getElementById('green').addEventListener('mouseup', function() { g_selectedColor[1] = (this.value / 255)});
  document.getElementById('blue').addEventListener('mouseup', function() { g_selectedColor[2] = (this.value / 255)});
  document.getElementById('alpha').addEventListener('mouseup', function() { g_selectedColor[3] = (this.value / 100)});
  //size
  document.getElementById('size').addEventListener('mouseup', function() { g_selectedSize = this.value});
  //number of segments (for circle)
  document.getElementById('segments').addEventListener('mouseup', function() {g_numSegments = this.value});


  //console.log("red:",r);
  //console.log("green:",g);
  //console.log("blue:",b);
  //console.log(g_selectedColor);
}

function main() {
  

  setupWebGL();
  connectVariablesToGLSL();

  
  //event handler for html ui actions
  addActionsFromHtmlUI();
  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //const b1 = document.querySelector('input[id="b1"]');

  //const squa = document.querySelector('input[id="b2"]');
  //const circ = document.querySelector('input[id="b3"]');
  //const tri = document.querySelector('input[id="b4"]');
  

  //clear canvas when "clear canvas button is clicked"
  //b1.addEventListener("click", clear_canvas_event);

  
  
  
}

/*
setupWebGL() – get the canvas and gl context
connectVariablesToGLSL() – compile the shader programs, attach the javascript variables to the GLSL variables
renderAllShapes()
*/


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}


function click(ev) {
  
  let [x, y] = convertCoordinatesEventToGL(ev);


  let point;
  if (g_selectedType == POINT){
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  }
  else {
    point = new Circle();  
    point.segments = g_numSegments;
  }

  if (g_rainbow){
    g_selectedColor[0] = ((g_selectedColor[0]*255 + 2) % 255)/255;
    g_selectedColor[1] = ((g_selectedColor[1]*255 + 4) % 255)/255;
    g_selectedColor[2] = ((g_selectedColor[2]*255 + 1) % 255)/255;

  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

/*
  // Store the coordinates to g_points array
  g_points.push([x, y]);
  // Store the coordinates to g_points array
  g_colors.push(g_selectedColor.slice());

  g_sizes.push(g_selectedSize);
*/
/*
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
*/
  renderAllShapes();
}



function clear_canvas_event(){
  
  g_shapesList = [];

  console.log(gl);

  var r = document.getElementById('red').value;
  var g = document.getElementById('green').value;
  var b = document.getElementById('blue').value;
  var a = document.getElementById('alpha').value;
  console.log("red:",r);
  console.log("green:",g);
  console.log("blue:",b);
  console.log("alpha:",a);
  renderAllShapes();
}

//1 = triangle
//2 = circle
//3 = square
function triangle_event(){
  //set drawing mode global variable to 1 for triangle
  drawing_mode = 1;
  console.log("triangle mode");
}

function circle_event(){
//set drawing mode global variable to 2 for circle
  drawing_mode = 2;
  console.log("circle mode");
}

function square_event(){
//set drawing mode global variable to 3 for square
  drawing_mode = 3;
  console.log("square mode");
}

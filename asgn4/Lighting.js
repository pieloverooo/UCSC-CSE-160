//assigment 3, blocky world

//import Model from "./Model";

//I apologize for the lack of comments, it became a little too much do document this mess when I finished this, I will add more comments in the next assigment as I do it.

// Vertex shader program
var VSHADER_SOURCE = `
  //precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_vertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_NormalMatrix;
  
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_vertPos = u_ModelMatrix * a_Position;
    //v_Normal = a_Normal;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D sky;
  uniform sampler2D grass;
  uniform sampler2D wood;
  uniform int u_whichTexture;
  uniform vec3 u_lightPosition;
  uniform vec3 u_cameraPos;
  varying vec4 v_vertPos;


  void main() {
    vec4 texture_sky = texture2D(sky, v_UV);
    vec4 texture_grass = texture2D(grass, v_UV); 
    vec4 texture_wood = texture2D(wood, v_UV);
   
    

    if (u_whichTexture == 2) {
      gl_FragColor = u_FragColor;               //use passed color
    } else if (u_whichTexture == 1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);      //use uvs
    } else if (u_whichTexture == 0) {
      //gl_FragColor = texture2D(sky, v_UV);    //use sky texture
      gl_FragColor = texture_sky;
    } else if (u_whichTexture == 3) {
      //gl_FragColor = texture2D(grass, v_UV); //use grass texture
      gl_FragColor = texture_grass;
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture_wood;             //use wood texture
    } else if (u_whichTexture == 5) {
     gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); //normal
    } else {
     gl_FragColor = vec4(1, .2, .2, 1);
    }


    vec3 lightVector = vec3 (v_vertPos) - u_lightPosition;
    float r = length(lightVector);
    //if (r <  1.0) {
    //  gl_FragColor = vec4(1,0,0,1); 
    //} else if (r < 2.0 ){
    // gl_FragColor = vec4(0,1,0,1);
    //}

//    gl_FragColor = vec4(vec3(gl_FragColor)/(r*r), 1);

  //n dot l
  vec3 L = normalize(lightVector);

  vec3 N = normalize(v_Normal);

  float nDotl = max(dot(N,L), 0.0);
  //gl_FragColor = gl_FragColor * nDotl;
  //gl_FragColor.a = 1.0;

  //reflection
  vec3 R = reflect(-L, N);

  //eye
  vec3 E = normalize(u_cameraPos - vec3(v_vertPos));

  //specular
  float specular = pow(max(dot(E,R), 0.0), 10.0);


  //diffuse and ambient
  vec3 diffuse = vec3(gl_FragColor) * nDotl;
  vec3 ambient = vec3(gl_FragColor) * 0.3;
  
  //final color
  gl_FragColor = vec4(specular + diffuse + ambient, 1.0);

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
let u_NormalMatrix;
let a_Normal;
let u_lightPosition;
let g_lastframe = 0;
let g_deltatime = 0;
let g_yaw = 0;
let g_pitch = 0.0;
let g_sensitivity = 0.1;
let g_fov = 90.0;
let g_moveSpeed = 2.0;
let camera = null;
let u_cameraPos;
let camMouseMove = false;

var lightPos = [2.1,5.2,1.5];


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

  sky = gl.getUniformLocation(gl.program, "sky");
  if(!sky) {
    console.log("Failed to get storage loc of sky texture");
    return false;
  }

  grass = gl.getUniformLocation(gl.program, "grass");
  if(!grass) {
    console.log("Failed to get storage loc of grass texture");
    return false;
  }

  wood = gl.getUniformLocation(gl.program, "wood");
  if(!wood) {
    console.log("Failed to get storage loc of wood texture");
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

  u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  if (!u_NormalMatrix) {
    console.log("failed to get normal matrix");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (!a_UV){  
    console.log("error getting a_UV");
  }

  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if(!a_Normal) {
    console.log("error getting a_normal");
  }

  u_lightPosition = gl.getUniformLocation(gl.program, "u_lightPosition");
  if (!u_lightPosition){
    console.log("failed to get light position");  
  }

  u_cameraPos = gl.getUniformLocation(gl.program, "u_cameraPos");
  if (!u_cameraPos){
    console.log("failed to get camerapos");
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  

}



function initTextures(/*gl, n*/){
  
  var sky_texture = gl.createTexture();
  if(!sky_texture){
    console.log("failed to create texure object for sky");
    return false;
  }
  

  var sky_img = new Image();
    if (!sky_img) {
      console.log("failed to create image object");
      return false;
    }
  
  sky_img.src = "sky.jpg";

  sky_img.onload = function() { 
      
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sky_texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, sky_img);

    gl.uniform1i(sky, 0);

  }


  var grass_texture = gl.createTexture();
  if(!grass_texture){
    console.log("failed to create texure object for sky");
    return false;
  }
 

  var grass_img = new Image();
  if (!grass_img) {
    console.log("failed to create image object for grass");
    return false;
  }

  grass_img.src = "grass.jpg";  
  
  
  grass_img.onload = function() { 
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, grass_texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grass_img);

    gl.uniform1i(grass, 1);


  }
  
  var wood_texture = gl.createTexture();
  if(!wood_texture){
    console.log("failed to create texure object for sky");
    return false;
  }
  
  var wood_img = new Image();
  if (!wood_img) {
    console.log("failed to create image object for wood");
    return false;
  }

  wood_img.src = "wood.jpg";  
  
  
  wood_img.onload = function() { 
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, wood_texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, wood_img);

    gl.uniform1i(wood, 2);


  }
  
  console.log("finished loading textures");
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

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  
}

//globals for testing
var g_eye = new Float32Array([0,0,2]);
var g_at = [0,0,-1];
var g_up = [0,1,0];

function renderScene(){

  var startTime = performance.now();
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);



  gl.uniform3f(u_lightPosition, lightPos[0], lightPos[1], lightPos[2]);

  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2])
  //var projMat = new Matrix4(); 
  
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
  //var veiwMat = new Matrix4();
  
  

  
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);



  var globalRotMatrix = new Matrix4().rotate(g_globalAngle, 1, 1, 1);
  
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);
  
  
  origin = new Cube();
  origin.color = [0.5,0.5,0.5,1];
  origin.textureNum = 5;
  origin.matrix.scale(-5,-5,-5);
  origin.normalMatrix.setInverseOf(origin.matrix).transpose();
  
  //ball = new Sphere();
  //ball.render();
  //teapot = new Model(gl, "teapot.obj");
  //origin.quickRender();

  //origin.render();
  //cube.render()
  gl.disableVertexAttribArray(0);
  gl.disableVertexAttribArray(1);
  gl.disableVertexAttribArray(2); 
  //teapot.render();
  teapot.matrix.setTranslate(0,0,0);
  teapot.matrix.translate(0,3,0);
  //teapot.render(gl, gl.program);
  gl.uniform1i(u_whichTexture, 5);
  sponza.render(gl, gl.program);
  //drawMap_h();
  //gl.clear(gl.ARRAY_BUFFER);
  
  var duration = performance.now() - startTime;

  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");


}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;



function tick() {
  
  g_seconds = performance.now()/1000.0-g_startTime;

//  g_deltatime = performance.now() - g_lastframe;
//  g_lastframe = performance.now();

  lightPos[0] = Math.cos(g_seconds) * lightPos[0];
  //lightPos[1] = Math.sin(g_seconds) * lightPos[1];


  
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


let g_globalAngle = 0;


function addActionsFromHtmlUI() {

  //-------buttons-------
  //change rendered world buttons
  document.getElementById('load_map_1').onclick = function() {g_currentMap = g_map_1; renderScene();};
  document.getElementById('load_map_2').onclick = function() {g_currentMap = g_map_2; renderScene();};
  document.getElementById('load_map_3').onclick = function() {g_currentMap = g_map_3; renderScene();};

  //-------sliders-------
  //angle slider
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); sendTextToHTML(g_globalAngle + " degrees", "cam_angle");});
  document.getElementById('light_x').addEventListener('mousemove', function() { lightPos[0] = this.value; renderScene(); sendTextToHTML(lightPos[0], "lightx"); });
  document.getElementById('light_y').addEventListener('mousemove', function() { lightPos[1] = this.value; renderScene(); sendTextToHTML(lightPos[1], "lighty"); });
  document.getElementById('light_z').addEventListener('mousemove', function() { lightPos[2] = this.value; renderScene(); sendTextToHTML(lightPos[2], "lightz"); });

}

let teapot = null;
let sponza = null;

function main() {
  
  setupWebGL();
  connectVariablesToGLSL();

  
  //event handler for html ui actions
  addActionsFromHtmlUI();


  initTextures();
  //canvas.onmousedown = shift_click;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  camera = new Camera(g_fov, canvas.width/canvas.height, 0.1, 1000);
  camera.updateCameraVecs();
  document.onkeydown = camMove;
  document.onmousemove = camTurn;
  //document.onmousedown = camTurn;
  canvas,onmousedown = toggleMouseCam;
  //requestAnimationFrame(tick);
  teapot = new Model(gl, "teapot.obj");
  sponza = new Model(gl, "sponza.obj");
  sponza.matrix.scale(0.05,0.05,0.05);
  renderScene();

  //requestAnimationFrame(tick);
  
}

function camMove(ev){
  camera.handleMove(ev.keyCode);
  renderScene();
}

function camTurn(ev) {
  //let [x,y] = convertCoordinatesEventToGL(ev);
  let x = ev.clientX;
  let y = ev.clientY;

  if (camMouseMove == true){
        
    camera.handleMouseTurn(x,y);
  }
  renderScene();
}

function toggleMouseCam(){
  camMouseMove = !camMouseMove;
  console.log("mouse cam toggled, value:", camMouseMove);
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


/*
function shift_click(ev) {
  if (ev.shiftKey) {
    g_special_animate = !g_special_animate;
    console.log("shift click");
    //console.log(g_special_animate);
  }
  //console.log("clicked");
}
*/

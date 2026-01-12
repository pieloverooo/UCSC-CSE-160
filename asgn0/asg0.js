// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  //var v1 = new Vector3([2.25,2.25,0]);
  //console.log(v1);

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, 400, 400);        // Fill a rectangle with the color

  //drawVector(v1, "red");

  const b1 = document.querySelector('input[id="b1"]');
  const b2 = document.querySelector('input[id="b2"]');
  
  b1.addEventListener("click", handleDrawEvent);
  b2.addEventListener("click", handleDrawOperationEvent);
  
}

function handleDrawEvent(){
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgb(0, 0, 0)";

  ctx.fillRect(0,0,400,400);

  var x1 = document.getElementById('x1pos').value;
  var y1 = document.getElementById('y1pos').value;

  var v1 = new Vector3([x1,y1,0]);

  var x2 = document.getElementById('x2pos').value;
  var y2 = document.getElementById('y2pos').value;
  var v2 = new Vector3([x2,y2,0]);
  
  drawVector(v1, "red");
  drawVector(v2, "blue");

  delete(v1);
  delete(v2);
}

function drawVector(v, color) {
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  var [x, y] = v.elements;
  //console.log(x);
  //console.log(y);

  //console.log(color);
  
  ctx.strokeStyle = color;
  
  ctx.beginPath();
  ctx.moveTo(200,200);
  ctx.lineTo(200+(20*x),200-(20*y));
  ctx.stroke();
}

function handleDrawOperationEvent() {
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgb(0, 0, 0)";

  ctx.fillRect(0,0,400,400);

  var op = document.getElementById("operation-select").value;
  
  var scalar = document.getElementById("scalar").value;

  //console.log(scalar);

  //console.log(op);
  

  var x1 = document.getElementById('x1pos').value;
  var y1 = document.getElementById('y1pos').value;

  var v1 = new Vector3([x1,y1,0]);

  var x2 = document.getElementById('x2pos').value;
  var y2 = document.getElementById('y2pos').value;
  var v2 = new Vector3([x2,y2,0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");

  switch (op) {
    case "add":
      drawVector(v1.add(v2), "green");
      break;
    case "subtract":
      drawVector(v1.sub(v2), "green");
      break;
    case "multiply":
      drawVector(v1.mul(scalar), "green");
      drawVector(v2.mul(scalar), "green");
    break;
    case "divide":
      drawVector(v1.div(scalar), "green");
      drawVector(v2.div(scalar), "green");
    break;
    case "magnitude":
      console.log("v1 magnitude: ", v1.magnitude());
      console.log("v2 magnitude: ", v2.magnitude());
      break;
    case "normalize":
      drawVector(v1.normalize(), "green");
      drawVector(v2.normalize(), "green");  
      break;
    case "angle between":
      //console.log(Vector3.dot(v1,v2));
      let angle = angleBetween(v1, v2);
      console.log("angle between v1 and v2:", angle);
      break;
    case "area":
      let area = areaTriangle(v1, v2);
      console.log("triangle area:", area);
      break;
  }

}

function angleBetween(v1, v2){
  var d, m1, m2, alpha;
  
  d = Vector3.dot(v1,v2);

  m1 = v1.magnitude();
  m2 = v2.magnitude();

  alpha = Math.acos(d / (m1 * m2));
  alpha = alpha * (180/Math.PI);
  return alpha;
}

function areaTriangle(v1, v2){
  var a, m;

  let v3 = new Vector3()
  v3 = Vector3.cross(v1,v2);
  //console.log(v3);

  m = v3.magnitude();

  a = m/2;

  delete(v3);

  return a;
}
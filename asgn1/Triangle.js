class Triangle{
    constructor(){
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 10.0;
        this.I_angle = 0;
    }

    render() {
        let angle = this.I_angle;
        //this.position[0] = this.position[0] * Math.cos(angle*Math.PI/180)*d - this.position[1]*Math.sin(angle*Math.PI/180)*d;
        //this.position[1] = this.position[0] * Math.sin(angle*Math.PI/180)*d + this.position[1]*Math.cos(angle*Math.PI/180)*d;

        //console.log(this.position[0]);
        //console.log(this.position[1]);

        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        var d = this.size/200.0;

        let centerPt = [ xy[0], xy[1] ];

        //let angle2 = 5;
        let angle2 = angle + 90;

        let vec1 = [Math.cos(angle*Math.PI/180)*d, Math.sin(angle*Math.PI/180)*d];
        let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];

        let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
        

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

       // gl.PushMatrix();

        //gl.Translatef()

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        gl.uniform1f(u_Size, size);

        //draw
        
        //drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
       // console.log("points", xy, pt1, pt2);
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
    }
}


function drawTriangle(vertices) {
//    var vertices = new Float32Array([
//    0, 0.5,   -0.5, -0.5,   0.5, -0.5
//  ]);
    var n = 3; // The number of vertices
    //verts = new Float32Array( [0.0, 0.0, 0.2, 0.0, 0.2, 0.2] );
    //console.log("verts: ", verts);
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    //console.log("vert array: ", vertices);
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    /*
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    */
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  //return n;
}


class Defined_tri {

    constructor(){
        this.type = 'defined_triangle';
        this.position = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 10.0;
        //this.I_angle = 0;
    }

    render() {

        var rgba = this.color;
        var pos = this.position;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //console.log("punts", pos[0]/400, pos[1]/400, pos[2]/400, pos[3]/400, pos[4]/400, pos[5]/400);
        //gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
        
        //2.0 * xScreen / canvasWidth - 1.0,
        //1.0 - 2.0 * yScreen / canvasHeight
        
        //console.log(this.position.slice());
        //x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);

        //y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
/*
        drawTriangle( [ ((pos[0] - 8) - (canvas.width/2) ) / (canvas.width/2), (canvas.height/2 - (pos[1] - 8)) / (canvas.height/2) , 
                      ((pos[2] - 8) - (canvas.width/2) ) / (canvas.width/2), (canvas.height/2 - (pos[3] - 8)) / (canvas.height/2), 
                      ((pos[4] - 8) - (canvas.width/2) ) / (canvas.width/2), (canvas.height/2 - (pos[5] - 8)) / (canvas.height/2) ]);
*/
        drawTriangle( [ ((pos[0]) - (canvas.width/2) ) / (canvas.width/2), (canvas.height/2 - (pos[1] )) / (canvas.height/2) , 
                      ((pos[2]  ) - (canvas.width/2) ) / (canvas.width/2), (canvas.height/2 - (pos[3] )) / (canvas.height/2), 
                      ((pos[4] ) - (canvas.width/2) ) / (canvas.width/2), (canvas.height/2 - (pos[5] )) / (canvas.height/2) ]);
  
    }
    
}

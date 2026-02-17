var g_uvBuffer = null;

class Cube {
    constructor(){
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        
        
        this.matrix = new Matrix4();
        this.textureNum = 0;
        //this.vertbuffer = null
        //this.uvbuffer = null;
        
        this.verts = [ -0.5, -0.5, -0.5,
                        0.5, -0.5, -0.5,
                        0.5,  0.5, -0.5,
                        
                        0.5,  0.5, -0.5,
                        -0.5,  0.5, -0.5,
                        -0.5, -0.5, -0.5,

                        -0.5, -0.5,  0.5,
                        0.5, -0.5,  0.5,
                        0.5,  0.5,  0.5,
                        
                        0.5,  0.5,  0.5,
                        -0.5,  0.5,  0.5,
                        -0.5, -0.5,  0.5,

                        -0.5,  0.5,  0.5,
                        -0.5,  0.5, -0.5,
                        -0.5, -0.5, -0.5,
                        
                        -0.5, -0.5, -0.5,
                        -0.5, -0.5,  0.5,
                        -0.5,  0.5,  0.5,

                        0.5,  0.5,  0.5,
                        0.5,  0.5, -0.5,
                        0.5, -0.5, -0.5,
                        
                        0.5, -0.5, -0.5,
                        0.5, -0.5,  0.5,
                        0.5,  0.5,  0.5,

                        -0.5, -0.5, -0.5,
                        0.5, -0.5, -0.5,
                        0.5, -0.5,  0.5,
                        
                        0.5, -0.5,  0.5,
                        -0.5, -0.5,  0.5,
                        -0.5, -0.5, -0.5,

                        -0.5,  0.5, -0.5,
                        0.5,  0.5, -0.5,
                        0.5,  0.5,  0.5,
                        
                        0.5,  0.5,  0.5,
                        -0.5,  0.5,  0.5,
                        -0.5,  0.5, -0.5];

        this.uv = [     0.0,  0.0,
                        1.0,  0.0,
                        1.0,  1.0,

                        1.0,  1.0,
                        0.0,  1.0,
                        0.0,  0.0,

                        0.0,  0.0,
                        1.0,  0.0,
                        1.0,  1.0,

                        1.0,  1.0,
                        0.0,  1.0,
                        0.0,  0.0,

                        1.0,  0.0,
                        1.0,  1.0,
                        0.0,  1.0,

                        0.0,  1.0,
                        0.0,  0.0,
                        1.0,  0.0,

                        1.0,  0.0,
                        1.0,  1.0,
                        0.0,  1.0,

                        0.0,  1.0,
                        0.0,  0.0,
                        1.0,  0.0,

                        0.0,  1.0,
                        1.0,  1.0,
                        1.0,  0.0,

                        1.0,  0.0,
                        0.0,  0.0,
                        0.0,  1.0,

                        0.0,  1.0,
                        1.0,  1.0,
                        1.0,  0.0,

                        1.0,  0.0,
                        0.0,  0.0,
                        0.0,  1.0];
                        


        this.verts32 = new Float32Array(this.verts);

        this.uv32 = new Float32Array(this.uv);

    }


    

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //fake ligthing
   
       // drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
       // drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);
// front
        //drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]);
        //drawTriangle3DUV( [1,0,0 , 1,1,0 , 1,1,1], [0,0, 1,1, 1,0]);
        //drawTriangle3DUV( [1,0,0 , 1,1,1 , 1,0,1], [0,0, 0,1, 1,1]);
        //drawTriangle3D( [1,0,0 , 1,1,0 , 1,1,1]);
        /*drawTriangle3D( [1,0,0 , 1,1,1 , 1,0,1]);
//gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.9, rgba[2]*.9, rgba[3]);
// top
        drawTriangle3D( [1,1,1 , 0,0,1 , 1,0,1]);
        drawTriangle3D( [1,1,1 , 0,1,1 , 0,0,1]);
//gl.uniform4f(u_FragColor, rgba[0]*.79, rgba[1]*.9, rgba[2]*.9, rgba[3]);
gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);        
// back
        drawTriangle3D( [0,0,0 , 0,1,0 , 0,1,1, 0,0,0 , 0,1,1 , 0,0,1]);
        drawTriangle3D( [0,0,0 , 0,1,1 , 0,0,1]);
gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

// bottom
        drawTriangle3D( [1,0,0 , 1,1,0 , 0,1,0]);
        drawTriangle3D( [1,0,0 , 0,1,0 , 0,0,0]);

gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
// left
        drawTriangle3D( [1,0,0 , 0,0,0 , 0,0,1]);
        drawTriangle3D( [1,0,0 , 0,0,1 , 1,0,1]);

        
// right
        drawTriangle3D( [1,1,0 , 0,1,0 , 0,1,1]);
        drawTriangle3D( [1,1,0 , 0,1,1 , 1,1,1]);
*/
/*
        
                

*/
       //drawMesh_no_uv(this.verts);
       drawMesh(this.verts, this.uv);

    }


    

    initVerts() {
        //var vertbuffer = gl.createBuffer();        
        this.vertbuffer = gl.createBuffer();
        if (!this.vertbuffer){
        //if (!vertbuffer){
                console.log("failed to create buffer object");
                return -1;
        }
                
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        //gl.bindBuffer(gl.ARRAY_BUFFER, vertbuffer);
        // Write date into the buffer object
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    }

   
    initUVs() {

        this.uvbuffer = gl.createBuffer();
                //var uvbuffer = gl.createBuffer();
                if (!this.uvbuffer){
                //if (!uvbuffer){
                        console.log("failed to create buffer object");
                        return -1;
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvbuffer);
                gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_UV);

    }


    quickRender() {
        var rgba = this.color;
        //var size = this.size;
        var n = this.verts.length / 3;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


        if (this.vertbuffer == null){
                this.initVerts();
        }

        gl.bufferData(gl.ARRAY_BUFFER, this.verts32, gl.STATIC_DRAW);

    // Assign the buffer object to a_Position variable

    // Enable the assignment to a_Position variable

        if (this.uvbuffer == null) {
                this.initUVs();
        }


        //gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
   
        gl.bufferData(gl.ARRAY_BUFFER, this.uv32, gl.DYNAMIC_DRAW);


        gl.drawArrays(gl.TRIANGLES, 0, n);
        
    }
    


    initUVCoord(){
        //does the same thing as init vertices but for the uv coords
        g_uvBuffer = gl.createBuffer();
        if (!g_uvBuffer){
                console.log("failed to create buffer object");
                return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);

        //gl.bufferData(gl.ARRAY_BUFFER, this.uv, gl.DYNAMIC_DRAW);
                                //change the number of items to 2 becuase each coord is u and v
        //gl.bufferData(gl.ARRAY_BUFFER, this.uv32, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_UV);

    }

/*
    renderFast() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        var n = this.verts.length / 3;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

       if (this.vertbuffer == null){
        //initTriangle3D();
        this.initVertBuffer();
       }

       gl.bufferData(gl.ARRAY_BUFFER, this.verts32, gl.DYNAMIC_DRAW);

       
       gl.drawArrays(gl.TRIANGLES, 0, n);
  


    }
*/

}

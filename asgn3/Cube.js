class Cube {
    constructor(){
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 10.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = 0;
        this.buffer = null;
        
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



    renderFast() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        var n = this.verts.length / 3;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

       if (g_vertexBuffer == null){
        initTriangle3D();
       }

       gl.bufferData(gl.ARRAY_BUFFER, this.verts32, gl.DYNAMIC_DRAW);

       gl.drawArrays(gl.TRIANGLES, 0, n);
  


    }

}


/*
//positions
-0.5, -0.5, -0.5,
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
-0.5,  0.5, -0.5




// texture coords
0.0,  0.0,
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
0.0,  1.0
*/
var g_uvBuffer = null;

class Cube {
    constructor(){
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        
        
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = 0;
        this.normalbuffer = null;
        
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
                        

        this.normals = [0.0,  0.0, -1.0,
                        0.0,  0.0, -1.0,
                        0.0,  0.0, -1.0,
                        0.0,  0.0, -1.0,
                        0.0,  0.0, -1.0,
                        0.0,  0.0, -1.0,
                        0.0,  0.0,  1.0,
                        0.0,  0.0,  1.0,
                        0.0,  0.0,  1.0,
                        0.0,  0.0,  1.0,
                        0.0,  0.0,  1.0,
                        0.0,  0.0,  1.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        -1.0,  0.0,  0.0,
                        1.0,  0.0,  0.0,
                        1.0,  0.0,  0.0,
                        1.0,  0.0,  0.0,
                        1.0,  0.0,  0.0,
                        1.0,  0.0,  0.0,
                        1.0,  0.0,  0.0,
                        0.0, -1.0,  0.0,
                        0.0, -1.0,  0.0,
                        0.0, -1.0,  0.0,
                        0.0, -1.0,  0.0,
                        0.0, -1.0,  0.0,
                        0.0, -1.0,  0.0,
                        0.0,  1.0,  0.0,
                        0.0,  1.0,  0.0,
                        0.0,  1.0,  0.0,
                        0.0,  1.0,  0.0,
                        0.0,  1.0,  0.0,
                        0.0,  1.0,  0.0];

        this.verts32 = new Float32Array(this.verts);

        this.uv32 = new Float32Array(this.uv);

        this.normals32 = new Float32Array(this.normals);
    }


    

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
       //drawMesh_no_uv(this.verts);
       //drawMesh(this.verts, this.uv);
        drawMeshWithNormal(this.verts32, this.uv32, this.normals32);
    }


    initVerts() {
        
        this.vertbuffer = gl.createBuffer();
        if (!this.vertbuffer){
                console.log("failed to create buffer object");
                return -1;
        }
                
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        
        // Write date into the buffer object
        
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    }

   
    initUVs() {

        this.uvbuffer = gl.createBuffer();
        
                if (!this.uvbuffer){
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

        
        if (this.normalbuffer == null) {
            this.normalBuffer = gl.createBuffer();

            
            if(!this.normalBuffer) {
                console.log("failed to create normal buffer");
                return -1;
            }
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            
        }


        gl.bufferData(gl.ARRAY_BUFFER, this.normals32, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0,0);
        
        gl.enableVertexAttribArray(a_Normal);

        this.normalMatrix = this.normalMatrix.setInverseOf(this.matrix);
        this.normalMatrix.transpose();
        this.normalMatrix.scale(-1,-1,-1);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

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

        //change the number of items to 2 becuase each coord is u and v
        

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_UV);

    }

}

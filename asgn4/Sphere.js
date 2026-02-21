var g_uvBuffer = null;

class Sphere {
    constructor(){
        this.type = 'sphere';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        
        
        this.matrix = new Matrix4();
        this.textureNum = 0;
        
        this.verts32 = new Float32Array([]);
    }


    

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        //pass texture num
        gl.uniform1i(u_whichTexture, this.textureNum);
        //pass color of point
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //pass matrix to modelmatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        
       //drawMesh_no_uv(this.verts);
       //drawMesh(this.verts, this.uv);

       var d = Math.PI/10;
       var dd = Math.PI/10;

        for (var t=0; t < Math.PI; t += d){
            for (var r = 0; r < (2*Math.PI); r += d){
                var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];

                var p2 = [sin(t*dd)*cos(r), sin(t*dd)*sin(r), cos(t*dd)];
                var p3 = [sin(t)*cos(r*dd), sin(t)*sin(r*dd), cos(t)];
                var p4 = [sin(t*dd)*cos(r*dd), sin(t*dd)*sin(r*dd), cos(t*dd)];

                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat([0,0]);
                v = v.concat(p2); uv = uv.concat([0,0]);
                v = v.concat(p4); uv = uv.concat([0,0]);

                gl.uniform4f(u_FragColor, 1,1,1,1);
                drawTriangle3DUVNormal(v, uv, v);
                //drawMeshWithNormal(v, uv, v);

                v = []; uv = [];
                v = v.concat(p1); uv = uv.concat([0,0]);
                v = v.concat(p4); uv = uv.concat([0,0]);
                v = v.concat(p3); uv = uv.concat([0,0]);
                gl.uniform4f(u_FragColor, 1,1,1,1);
                drawTriangle3DUVNormal(v, uv, v);
                //drawMeshWithNormal(v, uv, v);
            }
        }





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

function cos(x) {
        return Math.cos(x);
    }

    function sin(x) {
        return Math.sin(x);
    }
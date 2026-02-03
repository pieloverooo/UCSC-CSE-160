class Cube {
    constructor(){
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 10.0;
        //this.segments = 10;
        this.matrix = new Matrix4();

        this.buffer = null;

    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //fake ligthing
        

gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //act top
        drawTriangle3D( [1,1,1 , 0,0,1 , 1,0,1]);
        drawTriangle3D( [1,1,1 , 0,1,1 , 0,0,1]);
gl.uniform4f(u_FragColor, rgba[0]*.79, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //act front
        drawTriangle3D( [1,0,0 , 1,1,0 , 1,1,1]);
        drawTriangle3D( [1,0,0 , 1,1,1 , 1,0,1]);

gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);        
        //act back
        drawTriangle3D( [0,0,0 , 0,1,0 , 0,1,1]);
        drawTriangle3D( [0,0,0 , 0,1,1 , 0,0,1]);
gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        //act bottom
        drawTriangle3D( [1,0,0 , 1,1,0 , 0,1,0]);
        drawTriangle3D( [1,0,0 , 0,1,0 , 0,0,0]);

gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        //act left
        drawTriangle3D( [1,0,0 , 0,0,0 , 0,0,1]);
        drawTriangle3D( [1,0,0 , 0,0,1 , 1,0,1]);

        
        //act right
        drawTriangle3D( [1,1,0 , 0,1,0 , 0,1,1]);
        drawTriangle3D( [1,1,0 , 0,1,1 , 1,1,1]);

gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        
/*

        drawTriangle3D( [1,0,1, 1,1,1 , 0,0,1]);
        drawTriangle3D( [1,1,1 , 0,1,1 , 0,0,1]);

        drawTriangle3D( [1,1,0 , 0,1,0 , 0,1,1]);

        drawTriangle3D( [1,0,0 , 0,0,1 , 1,0,0]);
*/




           //drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
           //drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0 ]);
    }

}
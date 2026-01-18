class Point{
  constructor(){
    this.type = 'point';
    this.position = [0.0,0.0,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 10.0; 
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    //stop using the triangle buffer
    //gl.disableVertexAttribArray(a_Position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ xy[0], xy[1]]), gl.DYNAMIC_DRAW);

    //pass position of point to a_Position
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    //pass color to u_FragColor
    //console.log("a",rgba[3]);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //pass size to u_Size;
    gl.uniform1f(u_Size, size);

    //Draw
    gl.drawArrays(gl.POINTS, 0, 1);
    //drawTriangle( [xy[0], xy[1], xy[0]+.1, xy[1], xy[1]+.1]);

  }
}
//import { Matrix4 } from "../lib/cuon-matrix";
//import { OBJLoader } from "../lib/OBJLoader";

class Model {
  constructor(gl, filePath) {
    this.filePath = filePath;
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    
    this.loader = new OBJLoader(this.filePath);
    this.verts32 = null; 
    this.normals32 = null;
    this.loader.parseModel().then(() => {
      this.modelData = this.loader.getModelData();

      this.vertexBuffer = gl.createBuffer();
      this.normalBuffer = gl.createBuffer();

      if (!this.vertexBuffer || !this.normalBuffer) {
        console.log("failed to create buffers for", this.filepath);
        return;
      }


      console.log(this.modelData);
      this.verts32 = new Float32Array(this.modelData.vertices);
      //console.log(this.verts32);
      this.normals32 = new Float32Array(this.modelData.normals);
    });
  }

  render(gl, program) {
    if (!this.loader.isFullyLoaded) return;

    //vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.verts32,
      //new Float32Array(this.modelData.vertices),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    //normals
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.normals32,
      //new Float32Array(this.modelData.normals),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    //set uniform
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4fv(u_FragColor, this.color);

    //normal matrix
    let normalMatrix = new Matrix4().setInverseOf(this.matrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    //console.log(this.modelData.vertices.length / 3);
    gl.drawArrays(gl.TRIANGLES, 0, this.modelData.vertices.length / 3);
  }
}

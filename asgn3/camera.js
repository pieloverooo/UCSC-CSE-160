//this class is a mess because I wrote two different versions and have not deleted the code for one
//the version I am not using is the camera class described in the assignment description becuase parts of it did not work for me, so I decided
//instead to write a camera class following the camera example from learnopengl.com, most of the code should look similar and do about the same thing

class Camera {
    
    
    constructor (fov, aspect, near, far) {
        this.eye = new Vector3([5,6,3]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
        this.tempAt = new Vector3([0,0,0]);
        this.tempRight = new Vector3([0,0,0]);
        this.worldUp = new Vector3([0,1,0]);
        this.right = new Vector3([0,0,0]);
        this.moveSpeed = 0.8;//g_moveSpeed;
        this.cameraSens = 0.00002//g_sensitivity;

        this.yaw = -90;//1;
        this.pitch = 0;

        this.firstMouseMove = true;
        this.lastX = canvas.width / 2;
        this.lastY = canvas.height / 2;

        this.forwardVec = new Vector3([0,0,0]);
        this.sideVec = new Vector3([0,0,0]);
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
        //this.f_prime = null;
        //this.rotationMat = new Matrix4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        //console.log("rotation mat", this.rotationMat);
        console.log("veiw mat", this.viewMatrix);

        //this.viewMatrix.setLookAt(this.eye.elements, this.at.elements, this.up.elements);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0] + this.eye.elements[0], this.at.elements[1] + this.eye.elements[1], this.at.elements[2] + this.eye.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projectionMatrix.setPerspective(fov, aspect, near, far);
    


    }


    updateView() {
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0] + this.eye.elements[0], this.at.elements[1] + this.eye.elements[1], this.at.elements[2] + this.eye.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        //this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        //gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
        //gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
    }

/*

    moveForward() {
        this.forwardVec.set(this.at);
        this.forwardVec.sub(this.eye);
        this.forwardVec.normalize();

        this.forwardVec.mul(this.moveSpeed);

        this.eye.add(this.forwardVec);
        this.at.add(this.forwardVec);
        console.log("forwardvec", this.forwardVec);
        console.log("eye vec", this.eye);


    }

    moveBackward() {   
        this.forwardVec.set(this.at);
        this.forwardVec.sub(this.eye);
        this.forwardVec.normalize();

        this.forwardVec.mul(this.moveSpeed);

        this.eye.sub(this.forwardVec);
        this.at.add(this.forwardVec);
        console.log("forwardvec", this.forwardVec);
        console.log("eye vec", this.eye);
    }

    moveRight() {
        this.forwardVec.set(this.at);
        this.forwardVec.sub(this.eye);
        this.forwardVec.normalize();

        //this.forwardVec.mul(this.moveSpeed);

        this.sideVec = Vector3.cross(this.up, this.forwardVec);

        this.sideVec.normalize();

        this.sideVec.mul(this.moveSpeed);

        this.eye.sub(this.sideVec);

        this.at.sub(this.sideVec);
    }
    
    moveLeft() {
        this.forwardVec.set(this.at);
        this.forwardVec.sub(this.eye);
        this.forwardVec.normalize();

        //this.forwardVec.mul(this.moveSpeed);

        this.sideVec = Vector3.cross(this.up, this.forwardVec);

        this.sideVec.normalize();

        this.sideVec.mul(this.moveSpeed);

        this.eye.add(this.sideVec);

        this.at.add(this.sideVec);
        
    }

    moveUp() {
            this.eye.elements[1] += 0.2;
            this.at.elements[1] += 0.2;
    }

    moveDown() {
            this.eye.elements[1] -= 0.2;
            this.at.elements[1] -= 0.2;
    }

    
    panLeft() {
        
        this.yaw -= 0.1
        
        this.updatePitchYaw();

    }


    panRight() {
        this.yaw += 0.1
        

        this.updatePitchYaw();
        
    }
    */

    panUp() {
        this.pitch += 1.5;

        //this.updatePitchYaw();
        this.updateCameraVecs();
    }

    panDown() {
        this.pitch -= 1.5;

        //this.updatePitchYaw();
        this.updateCameraVecs();
    }
/*
   updatePitchYaw(){

    console.log("pitch", this.pitch);
    console.log("yaw", this.yaw);
        //recalculate the at vector
        this.tempAt.elements[0] = (Math.cos(this.yaw) * Math.cos(this.pitch));
        this.tempAt.elements[1] = Math.sin(this.pitch);
        this.tempAt.elements[2] = (Math.sin(this.yaw) * Math.cos(this.pitch));
        this.tempAt.normalize();
        this.at.set(this.tempAt);

        this.tempRight = Vector3.cross(this.at, this.worldUp);
        this.tempRight.normalize();
        this.up = Vector3.cross(this.tempRight, this.at);
        this.up.normalize();

   }
*/

    handleMove(keyCode) {
        
        if (keyCode == 68){ //D
            //g_eye[0] += 0.2;
            this.moveRight();
        } else if (keyCode == 65){ // A
            //g_eye[0] -= 0.2; 
            this.moveLeft();
        } 
        if (keyCode == 32) { // space
            //g_eye[1] += 0.2;
            this.moveUp();
        } else if (keyCode == 67) { // C
            //g_eye[1] -= 0.2;
            this.moveDown();
        }
        if (keyCode == 87) { // W
            //g_eye[2] -= 0.2;
            this.moveForward();
        } else if (keyCode == 83) { // S
            //g_eye[2] += 0.2;
            this.moveBackward();
        }
        if (keyCode == 69) {
            this.panRight();
        } else if (keyCode == 81) {
            this.panLeft();
        }
        if (keyCode == 82) {
            this.panUp();
        } else if (keyCode == 70) {
            this.panDown();
        }

        //renderScene();


        this.updateView();
        this.updateCameraVecs();

        console.log(keyCode);

    }
//82 -> R
//70 -> F
/*
    handleMouseTurn(x, y) {

        //let [x,y] = convertCoordinatesEventToGL(ev);

        //var x = ev.clientX;
        //var y = ev.clientY;

        console.log("x",x);
        console.log("y",y);

        var xpos = x;
        var ypos = y;
        if (this.firstMouseMove){
            this.lastX = xpos;
            this.lasty = ypos;
            this.firstMouseMove = false;
        }
        
        var xoffset = xpos - this.lastX;
        var yoffset = this.lastY - ypos;
        console.log("xoffset before scale:", xoffset);

        xoffset *= this.cameraSens;
        yoffset *= this.cameraSens;

        this.yaw   += xoffset;
        this.pitch += yoffset;
        console.log("xoffset", xoffset);
        console.log("yoffset", yoffset);
  
        console.log("yaw", this.yaw);
        console.log("pitch", this.pitch);
        
        //this.updateCameraVecs();
        this.updatePitchYaw();
        this.updateView();
    }
*/


//    viewMatrix (Matrix4), initialize it with viewMatrix.setLookAt(eye.elements[0],
//projectionMatrix (Matrix4), initialize it with projectionMatrix.setPerspective(fov, canvas.width/canvas.height, 0.1, 1000).
/*

    constructor (fov, aspect, near, far) {
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
        this.right = new Vector3([1,1,1]);
        this.tempAt = new Vector3(this.at.elements);
        this.worldUp = new Vector3([0,1,0]);
        this.tempRight = new Vector3([0,0,0]);
        this.tempUp = new Vector3([0,0,0]);
        this.moveSpeed = 0.1;//g_moveSpeed;
        this.yaw = g_yaw;
        this.pitch = g_pitch;
        //this.fov = g_fov;
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
        //this.velocity = 0;
        this.limitPitch = true;
        this.projectionMatrix.setPerspective(fov, aspect, near, far);
        this.firstMouseMove = true;
        this.lastX = canvas.width / 2;
        this.lastY = canvas.height / 2;

        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projectionMatrix.setPerspective(fov, aspect, near, far);
        
        this.updateCameraVecs();

    }

    updateView() {

        //this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0] + this.eye.elements[0], this.at.elements[1] + this.eye.elements[1], this.at.elements[2] + this.eye.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        //gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
        //gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
    }
*/
    updateCameraVecs() {
        console.log("camera vecs updated");
        console.log("yaw", this.yaw);
        this.tempAt.elements[0] = Math.cos(this.degreeToRad(this.yaw)) * Math.cos(this.degreeToRad(this.pitch));
        this.tempAt.elements[1] = Math.sin(this.degreeToRad(this.pitch));
        this.tempAt.elements[2] = Math.sin(this.degreeToRad(this.yaw)) * Math.cos(this.degreeToRad(this.pitch));
        this.tempAt.normalize();
        this.at.set(this.tempAt);
        

        this.tempRight = Vector3.cross(this.at, this.worldUp);
        this.right.set(this.tempRight);
        this.right.normalize();

        this.tempUp = Vector3.cross(this.right, this.at);
        this.up.set(this.tempUp);
        this.up.normalize();


        console.log("at", this.at);
        console.log("right", this.right);
        console.log("up", this.up);

    }


    //37 -> left arrow
//38 -> up arrow
//39 -> right arrow
//40 -> down arrow

//87 -> W
//65 -> A
//83 -> S
//68 -> D

//81 -> Q
//69 -> E

//32 -> space
//67 -> C

    



    moveForward() {
        var velocity = this.moveSpeed //* g_deltatime;
        
        //this.eye[2] += this.eye[2] +
        this.eye.add(this.at.mul(velocity));
    }

    moveBackward() {   
        var velocity = this.moveSpeed //* g_deltatime;
        this.eye.sub(this.at.mul(velocity));
    }

    moveRight() {
        //console.log("move right");
        var velocity = this.moveSpeed; //* 0.1//g_deltatime;
        console.log("deltatime", g_deltatime);
        console.log("velocity", velocity);
        console.log("movespeed", this.moveSpeed);
        console.log("right before move", this.right);
        this.eye.add(this.right.mul(velocity));
        console.log("eye", this.eye);
        console.log("right", this.right);
    }
    
    moveLeft() {
        var velocity = this.moveSpeed //* g_deltatime;
        this.eye.sub(this.right.mul(velocity));
    }


    panLeft() {
        //this.yaw -= 1.5;
        this.yaw-=5;

        this.updateCameraVecs();
    }

    panRight() {
        //this.yaw += 1.5;
        this.yaw+=5;
        this.updateCameraVecs();
    }


    moveUp() {
            this.eye.elements[1] += 0.2;
            this.at.elements[1] += 0.2;
    }

    moveDown() {
            this.eye.elements[1] -= 0.2;
            this.at.elements[1] -= 0.2;
    }

/*
    handleMove(keyCode) {
        
        if (keyCode == 68){ //D
            //g_eye[0] += 0.2;
            this.moveRight();
        } else if (keyCode == 65){ // A
            //g_eye[0] -= 0.2; 
            this.moveLeft();
        } 
        if (keyCode == 32) { // space
            //g_eye[1] += 0.2;
            this.moveUp();
        } else if (keyCode == 67) { // C
            //g_eye[1] -= 0.2;
            this.moveDown();
        }
        if (keyCode == 87) { // W
            //g_eye[2] -= 0.2;
            this.moveForward();
        } else if (keyCode == 83) { // S
            //g_eye[2] += 0.2;
            this.moveBackward();
        }
        if (keyCode == 69) {
            this.panRight();
        } else if (keyCode == 81) {
            this.panLeft();
        }

        renderScene();


        this.updateView();

        console.log(keyCode);

    }
    */

    degreeToRad(deg){
        return (Math.PI / 180) * deg;
    }
/*
    handleMove(keyCode) {
        console.log("vecs before move:");
        console.log("eye", camera.eye);
        console.log("right", camera.right);
        console.log("at", this.at);
        console.log("up", this.up);
        if (keyCode == 68){ //D
            //g_eye[0] += 0.2;
            this.moveRight();
        } else if (keyCode == 65){ // A
            //g_eye[0] -= 0.2; 
            this.moveLeft();
        } 
        if (keyCode == 32) { // space
            g_eye[1] += 0.2;
        } else if (keyCode == 67) { // C
            g_eye[1] -= 0.2;
        }
        if (keyCode == 87) { // W
            //g_eye[2] -= 0.2;
            this.moveForward();
        } else if (keyCode == 83) { // S
            //g_eye[2] += 0.2;
            this.moveBackward();
        }
        if (keyCode == 69) {
            this.panRight();
        } else if (keyCode == 81) {
            this.panLeft();
        }

        renderScene();

        console.log(keyCode);

    }

    handleMouseTurn(x, y) {

        //let [x,y] = convertCoordinatesEventToGL(ev);

        //var x = ev.clientX;
        //var y = ev.clientY;

        console.log("x",x);
        console.log("y",y);

        var xpos = x;
        var ypos = y;
        if (this.firstMouseMove){
            this.lastX = xpos;
            this.lasty = ypos;
            this.firstMouseMove = false;
        }
        
        var xoffset = xpos - this.lastX;
        var yoffset = this.lastY - ypos;


        xoffset *= g_sensitivity;
        yoffset *= g_sensitivity;

        this.yaw   += xoffset;
        this.pitch += yoffset;
        console.log("xoffset", xoffset);
        console.log("yoffset", yoffset);
  
        console.log("yaw", this.yaw);
        console.log("pitch", this.pitch);
        
        this.updateCameraVecs();
    }




*/


}
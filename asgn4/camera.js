
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
        this.cameraSens = 0.002//g_sensitivity;
        this.restrict_pitch = true;
        this.yaw = 200;//1;
        this.pitch = 0;

        this.firstMouseMove = true;
        this.lastX = canvas.width / 2;
        this.lastY = canvas.height / 2;

        this.forwardVec = new Vector3([0,0,0]);
        this.sideVec = new Vector3([0,0,0]);
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();
       
        console.log("veiw mat", this.viewMatrix);

        
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0] + this.eye.elements[0], this.at.elements[1] + this.eye.elements[1], this.at.elements[2] + this.eye.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projectionMatrix.setPerspective(fov, aspect, near, far);
    

    }


    updateView() {
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0] + this.eye.elements[0], this.at.elements[1] + this.eye.elements[1], this.at.elements[2] + this.eye.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        
        
    }



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

        //console.log(keyCode);

    }
//82 -> R
//70 -> F
updateCameraVecs() {
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
    
    
    this.eye.add(this.at.mul(velocity));
}

moveBackward() {   
    var velocity = this.moveSpeed //* g_deltatime;
    this.eye.sub(this.at.mul(velocity));
}

moveRight() {
    
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

degreeToRad(deg){
    return (Math.PI / 180) * deg;
}

handleMouseTurn(x, y) {
    
    //let [x,y] = convertCoordinatesEventToGL(ev);
    
    
    
        var xpos = x;
        var ypos = y;
        if (this.firstMouseMove){
            this.lastX = xpos;
            this.lasty = ypos;
            this.firstMouseMove = false;
        }
        
        var xoffset = xpos - this.lastX;
        var yoffset = this.lastY - ypos;

        


        xoffset *= 0.003;//g_sensitivity;
        yoffset *= 0.003;

        this.yaw   += xoffset;
        this.pitch += yoffset;

        if (this.restrict_pitch){
            if (this.pitch > 89) {
                this.pitch = 89;
            }

            if (this.pitch < -89) {
                this.pitch = -89;
            }
        }

       
        
        this.updateCameraVecs();
        this.updateView();
    }


}


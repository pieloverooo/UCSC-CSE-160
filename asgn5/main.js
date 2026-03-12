//water effect from https://discourse.threejs.org/t/low-poly-ocean-water/33513/2
import * as THREE from 'three';

import { OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

function main() {
	//console.log("hello");
	const canvas = document.querySelector( '#c' );
	//const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	/*{
		const mtlLoader = new MTLLoader();
		const objLoader = new OBJLoader();
		mtlLoader.load('../sponza/Sponza-master/sponza.mtl', (mtl) => {
			mtl.preload();
			for (const material of Object.values(mtl.materials)) {
				material.side = THREE.DoubleSide;
			}
			objLoader.setMaterials(mtl);
			objLoader.load('../sponza/Sponza-master/sponza.obj', (root) => {
				
				scene.add(root);
			});
		});
	}*/


	
	const renderer = new THREE.WebGLRenderer( {
		canvas,
		logarithmicDepthBuffer: true,
		antialias: true,
		alpha: true
	} );
	renderer.shadowMap.enabled = true;
	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.00001;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 10, 6, 10 );

	class ColorGUIHelper {

		constructor( object, prop ) {

			this.object = object;
			this.prop = prop;

		}
		get value() {

			return `#${this.object[ this.prop ].getHexString()}`;

		}
		set value( hexString ) {

			this.object[ this.prop ].set( hexString );

		}

	}

	class MinMaxGUIHelper {

		constructor( obj, minProp, maxProp, minDif ) {

			this.obj = obj;
			this.minProp = minProp;
			this.maxProp = maxProp;
			this.minDif = minDif;

		}
		get min() {

			return this.obj[ this.minProp ];

		}
		set min( v ) {

			this.obj[ this.minProp ] = v;
			this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

		}
		get max() {

			return this.obj[ this.maxProp ];

		}
		set max( v ) {

			this.obj[ this.maxProp ] = v;
			this.min = this.min; // this will call the min setter

		}

	}

	class FogGUIHelper {

		constructor( fog, backgroundColor ) {

			this.fog = fog;
			this.backgroundColor = backgroundColor;

		}
		get near() {

			return this.fog.near;

		}
		set near( v ) {

			this.fog.near = v;
			this.fog.far = Math.max( this.fog.far, v );

		}
		get far() {

			return this.fog.far;

		}
		set far( v ) {

			this.fog.far = v;
			this.fog.near = Math.min( this.fog.near, v );

		}
		get color() {

			return `#${this.fog.color.getHexString()}`;

		}
		set color( hexString ) {

			this.fog.color.set( hexString );
			this.backgroundColor.set( hexString );

		}

	}

	

	function updateCamera() {

		camera.updateProjectionMatrix();

	}

	const gui = new GUI();
	gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
	const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
	gui.add( minMaxGUIHelper, 'min', 0.00001, 50, 0.00001 ).name( 'near' ).onChange( updateCamera );
	gui.add( minMaxGUIHelper, 'max', 0.1, 1000, 1 ).name( 'far' ).onChange( updateCamera );
	

	const controls = new FirstPersonControls( camera, canvas );
	//const controls = new OrbitControls( camera, canvas );
	controls.movementSpeed = 1;
	//controls.rollSpeed = Math.PI / 2;
	//controls.activeLook = false;
	//controls.autoForward = false
	//controls.dragToLook = true;
	//controls.mouseDragOn = true;
	controls.lookspeed = 1;
	//controls.target.set( 0, 5, 0 );
	//controls.update();
	//controls.change();


	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

	function dumpObject(obj, lines = [], isLast = true, prefix = '') {
 		const localPrefix = isLast ? '└─' : '├─';
  		lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  		const newPrefix = prefix + (isLast ? '  ' : '│ ');
  		const lastNdx = obj.children.length - 1;
  		obj.children.forEach((child, ndx) => {
    	const isLast = ndx === lastNdx;
    	dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}
	let boat;
	const gltfLoader = new GLTFLoader();
	//boat model
	{
		
		const url = '../boat_lowpoly/boat.gltf';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;	
		//root.traverse(function(child) {
    	//if (child.isMesh) {
		//	child.castShadow = true;
		//	child.receiveShadow = true;
		//}
		//})

		root.scale.set(.02*root.scale.x, .02* root.scale.y, .02 * root.scale.z);
		root.position.set(root.position.x  +0.64, root.position.y + 1.6, root.position.z  - 2.32);
		root.rotation.set(root.rotation.x - 0.1822, root.rotation.y, root.rotation.z);
		scene.add(root);
		//console.log(dumpObject(root).join('\n'));
		//makeXYZGUI( gui, root.position, 'boat position', updateCamera );
		//makerotGUI( gui, root.rotation, 'boat rotation', updateCamera);
		});

	}
	//tree model
	{
		const url = '../coconut_tree/scene.gltf';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;	
		//root.traverse(function(child) {
    	//if (child.isMesh) {
		//	child.castShadow = true;
		//	child.receiveShadow = true;
		//}
		//})
		
		root.scale.set(2.5*root.scale.x, 2.5* root.scale.y, 2.5 * root.scale.z);
		root.position.set(root.position.x+ 4.56, root.position.y + 3.6, root.position.z+17.36);
		root.rotation.set(root.rotation.x + 0.10681, root.rotation.y, root.rotation.z + 0.02513);
		scene.add(root);
		

		
		//console.log(dumpObject(root).join('\n'));
		//makeXYZGUI( gui, root.position, 'tree position', updateCamera );
		//makerotGUI( gui, root.rotation, 'tree rotation', updateCamera);

		});

	}

	//beach ball
	{
		const url = '../beach_ball_-_low_poly/scene.gltf';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;	
		//root.traverse(function(child) {
    	//if (child.isMesh) {
		//	child.castShadow = true;
		//	child.receiveShadow = true;
		//}
		//})
		
		root.scale.set(2.5*root.scale.x, 2.5* root.scale.y, 2.5 * root.scale.z);
		root.position.set(root.position.x - 14.08, root.position.y + 4, root.position.z+3.6);
		root.rotation.set(root.rotation.x + 0.67, root.rotation.y + 0.7561, root.rotation.z - 0.3330);
		scene.add(root);
		

		
		//console.log(dumpObject(root).join('\n'));
		//makeXYZGUI( gui, root.position, 'beachball position', updateCamera );
		//makerotGUI( gui, root.rotation, 'beachball rotation', updateCamera);

		});



	}

	

	//tree
	{
		const url = '../coconut_tree/scene.gltf';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;	
		//root.traverse(function(child) {
    	//if (child.isMesh) {
		//	child.castShadow = true;
		//	child.receiveShadow = true;
		//}
		//})
		
		root.scale.set(2.5*root.scale.x, 2.5* root.scale.y, 2.5 * root.scale.z);
		root.position.set(root.position.x -9.2, root.position.y + 3, root.position.z+21.28);
		root.rotation.set(root.rotation.x + 0.20734, root.rotation.y + 0.7561, root.rotation.z - 0.3330);
		scene.add(root);
		

		
		//console.log(dumpObject(root).join('\n'));
		//makeXYZGUI( gui, root.position, 'tree2 position', updateCamera );
		//makerotGUI( gui, root.rotation, 'tree2 rotation', updateCamera);

		});



	}



	//van model
	{
		const url = '../retro_van/scene.gltf';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;	
		root.scale.set(2*root.scale.x, 2* root.scale.y, 2 * root.scale.z);
		root.position.set(root.position.x -18, root.position.y + 5.8, root.position.z+10.5);
		root.rotation.set(root.rotation.x -0.0251, root.rotation.y + 2.990911, root.rotation.z -0.0251);
		scene.add(root);
		//console.log(dumpObject(root).join('\n'));
		
		
		//makeXYZGUI( gui, root.position, 'van position', updateCamera );
		//makerotGUI( gui, root.rotation, 'van rotation', updateCamera);
		
		});
	}
	//beach model
	{
		const url = '../beach/beach.gltf';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;	
		root.scale.set(2*root.scale.x, 2* root.scale.y, 2 * root.scale.z);
//18, 5.9, 10.5
		//root.castShadow = true;
		//root.receiveShadow = true;

		
		scene.add(root);
		//console.log(dumpObject(root).join('\n'));
		
		
		//makeXYZGUI( gui, root.position, ' beach position', updateCamera );
		});
	}

	
	{

		const loader = new THREE.TextureLoader();
  		const texture = loader.load(
			'images/kloofendal_48d_partly_cloudy_puresky_4k.png',
			() => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.colorSpace = THREE.SRGBColorSpace;
			scene.background = texture;
			});
	}


	//Water taken from example found at https://discourse.threejs.org/t/low-poly-ocean-water/33513/2
	{
		let g = new THREE.PlaneGeometry(36, 20, 15, 15);
		g.rotateX(-Math.PI * 0.5);
		let vertData = [];
		let v3 = new THREE.Vector3(); // for re-use
			for (let i = 0; i < g.attributes.position.count; i++) {
				v3.fromBufferAttribute(g.attributes.position, i);
			vertData.push({
				initH: v3.y,
				amplitude: THREE.MathUtils.randFloatSpread(2),
				phase: THREE.MathUtils.randFloat(0, Math.PI)
			})
		}

		let m = new THREE.MeshLambertMaterial({
		color: "aqua"
		});
		let o = new THREE.Mesh(g, m);
		o.position.y += 2.5;
		scene.add(o);

		o.position.set(o.position.x - 5.85, o.position.y , o.position.z - 3.28);
		//makeXYZGUI( gui, o.position, 'water position', updateCamera );

		let clock = new THREE.Clock();

		renderer.setAnimationLoop(() => {

		let time = clock.getElapsedTime();

		vertData.forEach((vd, idx) => {
			let y = vd.initH + Math.sin(time + vd.phase) * vd.amplitude;
			g.attributes.position.setY(idx, y);
		})
		g.attributes.position.needsUpdate = true;
		g.computeVertexNormals();

		renderer.render(scene, camera);
		});


	}

	

	/*

	{

		const near = 0.1;
		const far = 100;
		const color = 'lightblue';
		scene.fog = new THREE.Fog( color, near, far );
		scene.background = new THREE.Color( color );
		const folder = gui.addFolder( 'fog' );
		folder.open();
		const fogGUIHelper = new FogGUIHelper( scene.fog, scene.background );
		folder.add( fogGUIHelper, 'near', near, far ).listen();
		folder.add( fogGUIHelper, 'far', near, far ).listen();
		folder.addColor( fogGUIHelper, 'color' );

	}

*/
	/*{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		
		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
		//	map: texture,
			//side: THREE.DoubleSide,
		} );
		planeMat.color.setHSL(0.4, 1, 0.4)
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.receiveShadow = true;
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}*/

	{

		const sphereRadius = 3;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
		const numSpheres = 5;
		let spheres = [];
		let mats = [];
		for ( let i = 0; i < numSpheres; ++ i ) {

			const sphereMat = new THREE.MeshPhongMaterial();
			sphereMat.color.setHSL( 0, 1, 0.5 );
			const mesh = new THREE.Mesh( sphereGeo, sphereMat );
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.position.set( mesh.position.x + 0.5 , mesh.position.y + 4.25, mesh.position.z + 6.56);
			mesh.scale.set(mesh.scale.x* 0.2, mesh.scale.y* 0.2, mesh.scale.z* 0.2);
			
			spheres[i] = mesh;	
			mats[i] = sphereMat;
			scene.add( mesh );

		//	makeXYZGUI(gui, mesh.position, 'ball pos', updateCamera);

		}

		spheres[1].position.set(1.68, 5,  0.64 );
//		spheres[1].translateX(1);
		//makeXYZGUI(gui, spheres[1].position, 'yellow pos', updateCamera);
		

		spheres[2].position.set(-6, 5, 12);
		spheres[3].position.set(2.6, 14, 16.4);
		//spheres[4].position.set(2.6, 14, 16.4);
		//makeXYZGUI(gui, spheres[4].position, 'yellow pos', updateCamera);
		
		for (let i = 0; i < numSpheres; ++i){
			mats[i].color.setHSL( 0.7 * i, 1, 0.5);
		}



	}

	//cubes
	{
		const num_boxes = 3;
		let boxes = [];
		let mats = [];
		for ( let i = 0; i < num_boxes; ++ i ) {
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube = new THREE.Mesh( geometry, material );
		boxes[i] = cube;
		mats[i] = material;
		scene.add( cube );
		}
		boxes[0].position.set(3.6, 4.65, 9.52);
		boxes[1].position.set(0.64, 4, -5.2);
		boxes[1].rotation.set(-0.333, 0, 0);
		
		for (let i = 0; i < num_boxes; ++i){
			mats[i].color.setHSL( 0.4 * i, 1, 0.5);
		}
		//makeXYZGUI(gui, boxes[2].position, 'yellow pos', updateCamera);
		//makerotGUI(gui, boxes[2].rotation, 'yellow rot', updateCamera);
	
	}
	//torus
	{
		const num_toruses = 2;
		let donuts = [];
		let mats = [];
		for ( let i = 0; i < num_toruses; ++ i ) {
		const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		const torus = new THREE.Mesh( geometry, material );
		torus.scale.set(0.05, 0.05, 0.05);
		donuts[i] = torus;
		mats[i] = material;
		scene.add( torus );
		}

		for (let i = 0; i < num_toruses; ++i){
			mats[i].color.setHSL( 0.9 * i, 1, 0.5);
		}
		donuts[0].position.set(-11.12, 3.8, 0);
		donuts[0].rotation.set(-1.72, -0.0251, 0.2734);
		donuts[0].scale.set(0.1, 0.1,0.1);
		
		donuts[0].position.set(-11.12, 4, 12.48);
		donuts[0].rotation.set(-3.1164, -0.1, 0);
		//makeXYZGUI(gui, donuts[1].position, 'yellow pos', updateCamera);
		//makerotGUI(gui, donuts[1].rotation, 'yellow rot', updateCamera);

	}
	//icosohedron
	{
		const num_icos = 2;
		let icos = [];
		let mats = [];
		for ( let i = 0; i < num_icos; ++ i ) {
		const geometry = new THREE.IcosahedronGeometry();
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		const icosahedron = new THREE.Mesh( geometry, material );
		icos[i] = icosahedron;
		mats[i] = material;
		scene.add( icosahedron );
		}


		for (let i = 0; i < num_icos; ++i){
			mats[i].color.setHSL( 0.6 * i, 1, 0.6);
		}


		icos[0].position.set(-9.2, 3.6, 6.56);
		
		icos[1].scale.set(0.6, 0.6, 0.6);
		icos[1].position.set(0.64, 4.5, 11.52);
		icos[1].rotation.set(0.67, -0.1, 0.67);
		//makeXYZGUI(gui, icos[1].position, 'yellow pos', updateCamera);
		//makerotGUI(gui, icos[1].rotation, 'yellow rot', updateCamera);

	}
	//cylinders
	{
		const num_cyls = 2;
		let cyls = [];
		let mats = [];
		for ( let i = 0; i < num_cyls; ++ i ) {
		const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		const cylinder = new THREE.Mesh( geometry, material );
		cylinder.scale.set(0.1, 0.1, 0.1);
		cyls[i] = cylinder;
		mats[i] = material;
		scene.add( cylinder );
		}

		for (let i = 0; i < num_cyls; ++i){
			mats[i].color.setHSL( 0.7 * i, 1, 0.8);
		}

		cyls[0].position.set(-7.2, 3.5, 0.5);
		cyls[0].rotation.set(1.212, 0, 0);

		
		cyls[1].position.set(-2.32, 5, 16.4);
		cyls[1].rotation.set(0.439, 0, 0);
		//makeXYZGUI(gui,	cyls[1].position, 'yellow pos', updateCamera);
		//makerotGUI(gui, cyls[1].rotation, 'yellow rot', updateCamera);

	}

	//torus knot
	{
		const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		const torusKnot = new THREE.Mesh( geometry, material );
		torusKnot.scale.set(0.04,0.04,0.04);
		scene.add( torusKnot );
		//makeXYZGUI(gui,	torusKnot.position, 'yellow pos', updateCamera);
		//makerotGUI(gui, torusKnot.rotation, 'yellow rot', updateCamera);
	
		torusKnot.position.set(-17.4, 8.8, 9.52);
		torusKnot.rotation.set(-0.4, -0.95, -0.56);
		material.color.setHSL( 0.45, 1, 0.6);
		
	
	}
	//{
	//	let 
	//	const 
	//}
	/*
	{
		const boxWidth = 1;
		const boxHeight = 1;
		const boxDepth = 1;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
	
		const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } ); // greenish blue

		const cube = new THREE.Mesh( geometry, material );
		cube.castShadow = true;
		cube.receiveShadow = true;
		cube.position.set(0,6,0);

		scene.add( cube );
	}
	*/

	function makeXYZGUI( gui, vector3, name, onChangeFn ) {

		const folder = gui.addFolder( name );
		folder.add( vector3, 'x', - 40, 40 ).onChange( onChangeFn );
		folder.add( vector3, 'y', 0, 100 ).onChange( onChangeFn );
		folder.add( vector3, 'z', - 40, 40 ).onChange( onChangeFn );
		//folder.open();

	}

	function makerotGUI( gui, vector3, name, onChangeFn ) {

		const folder = gui.addFolder( name );
		folder.add( vector3, 'x', -Math.PI, Math.PI ).onChange( onChangeFn );
		folder.add( vector3, 'y', -Math.PI, Math.PI ).onChange( onChangeFn );
		folder.add( vector3, 'z', -Math.PI, Math.PI ).onChange( onChangeFn );
		//folder.open();

	}

	{

		const color = 0xFFFFFF;
		const intensity = 1000;
		const light = new THREE.PointLight( color, intensity );
		light.castShadow = true;
		light.position.set( 0, 10, 0 );
		scene.add( light );
		
		const helper = new THREE.PointLightHelper( light );
		scene.add( helper );

		function updateCamera() {
		}

		{
			const folder = gui.addFolder( 'light' );
			folder.open();
			folder.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
			folder.add( light, 'intensity', 0, 100000 );
			folder.add( light, 'distance', 0, 100000 ).onChange( updateCamera );
		}

		/*{
			const grndcolor = 0xFFFFFF;
			const hemiLight = new THREE.HemisphereLight( color, color, 0.6 ); 
			hemiLight.position.set(1,10,0);
			hemiLight.intensity = 1000;
			//scene.add( hemiLight );
			const helper = new THREE.HemisphereLightHelper( hemiLight );
		scene.add( helper );
		}*/
		/*{

			const folder = gui.addFolder( 'Shadow Camera' );
			folder.open();
			const minMaxGUIHelper = new MinMaxGUIHelper( light.shadow.camera, 'near', 'far', 0.1 );
			folder.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
			folder.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );

		}*/

		light.intensity = 20000;
		light.position.set(0, 50, 0);
		makeXYZGUI( gui, light.position, 'position', updateCamera );

	}
    
	
    
	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}


	

	function render() {

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		
		if(controls.mouseDragOn){
			controls.activeLook = true;
		} else {
			controls.activeLook = false;
		}
		
		renderer.render( scene, camera );
		
		controls.update(0.5);

		

		requestAnimationFrame( render );



	}

	requestAnimationFrame( render );

}

main();
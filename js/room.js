import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import * as Loader from './Loader.js'
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js'
import { TWEEN } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/libs/tween.module.min.js'


const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let initScroll = 0;
camera.position.set(-1.5,4,1);

camera.lookAt(0, 0, 1);

var listDynamicModel = new Array();
var batiments = new Array();



var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );


let controls = new OrbitControls( camera, renderer.domElement );

controls.enableZoom = false;
controls.enableRotate = true;
controls.target = new THREE.Vector3(camera.position.x+0.1, camera.position.y+0.1, camera.position.z+0.1)
controls.enablePan = true;
controls.panSpeed = 4000;
controls.keyPanSpeed = 26000;
controls.maxDistance = 2000;

renderer.render(scene, camera);

scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );
var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1);
light.position.set(0, 10, -1)
scene.add( light );

//-----------------------------------------------------------------------------INITIATE

Loader.LoadAsyncModelGLTF(scene,'./models/chambre.gltf',10,new THREE.Vector3(-2,-10,0),new THREE.Vector3(0,1.97,0),batiments,'maison');

animate();

//-----------------------------------------------------------------------------LISTENER

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener("keydown", event => {
    console.log(event.code);
    switch(event.code){
        case "Escape":
            document.location = '/index.html'
            break;
    }
});


//-----------------------------------------------------------------------------FUNCTION

function animate() {
	requestAnimationFrame( animate );
        const spin = 0.01;
        const delta = clock.getDelta();

        //if ( mixer ) mixer.update( delta );
        controls.update( clock.getDelta() );
		renderer.render( scene, camera );
};


import * as THREE from '../three/build/three.module.js';
import { FBXLoader } from '../three/examples/jsm/loaders/FBXLoader.js';
import * as Loader from './Loader.js'
import {OrbitControls} from '../three/examples/jsm/controls/OrbitControls.js'
import {TextureLoader, Box3, Vector3} from '../three/build/three.module.js';

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let initScroll = 0;
camera.position.set(0,0,10);

//camera.lookAt(0, 0, 0);

var plane,plane2,plane3;
var listDynamicModel = new Array();
var listStaticModel = new Array();
var me = new Array();

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*const controls = new OrbitControls( camera, renderer.domElement );
controls.update();*/

renderer.render(scene, camera);


scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );
var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1);
light.position.set(0, 300, 0)
scene.add( light );

light = new THREE.PointLight( 0xffffff, 1 );
light.position.set( 75, 300, -75 );
camera.add( light );

let mixer = new Array();
const loader = new FBXLoader();
let actualPos = new Array();
actualPos.push(0);
//-----------------------------------------------------------------------------INITIATE
const texture = new THREE.TextureLoader().load( './models/uploads_files_2149069_school_color.jpg' );
Loader.LoadAsyncModelFBXAnimate(scene,'./models/Walking.fbx',1,90,new Vector3(0,-0.8,8),mixer,me);
Loader.LoadAsyncModelFBX(scene,'./models/1.fbx',1.5,0,new Vector3(3,-0.62,5),listStaticModel);
Loader.LoadAsyncModelGLTF(scene,'./models/room.gltf',1,new Vector3(0,0,0),new Vector3(0,2,0),listStaticModel,'room');
//Loader.LoadAsyncModelFBX(scene,'./models/planet.fbx',4,0,new Vector3(3,-0.62,5),listStaticModel);
Loader.LoadImage(scene,'./models/intro.png',2,new Vector3(3,1,5),listStaticModel);
//Loader.LoadAsyncModelFBX(scene,'./models/school.fbx',1.5,0,new Vector3(1,1,1),listStaticModel,texture);
//Loader.LoadAsyncModelOBJ(scene,'./models/uploads_files_2149069_school_color.obj',1.5,0,new Vector3(1,1,1),listStaticModel,texture);
//await Loader.LoadModelOBJ(scene,'./models/uploads_files_2149069_school_color.obj', 2, listStaticModel,actualPos,texture);

const sky = skybox();
scene.add(sky);
planes();
animate();
console.log(scene.children);

//-----------------------------------------------------------------------------LISTENER
window.addEventListener("wheel", moveSlider);
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener("keydown", event => {
    if(me.length==0) return;
    switch(event.key){
        case "z":
            console.log("up");
            me[0].position.z --;
            camera.position.z --;
            //me.rotation = 
            break;
        case "q":
            console.log("left");
            me[0].position.x --;
            camera.position.x --;
            break;
        case "s":
            console.log("down");
            me[0].position.z ++;
            camera.position.z ++;
            break;
        case "d":
            console.log("right");
            me[0].position.x ++;
            camera.position.x ++;
            break;
    }
    console.log(event.key);
    // do something
  });
//-----------------------------------------------------------------------------FUNCTION
function moveSlider(e){
    initScroll -= e.deltaY/100 * 0.15
    if(initScroll<0) initScroll=0;
}


function animate() {
	requestAnimationFrame( animate );
        const delta = clock.getDelta();
	    sky.rotation.y += 0.0001;

        //camera.position.lerp(new THREE.Vector3(initScroll,0,10),0.05);

        listDynamicModel.forEach(element => element.position.lerp(new THREE.Vector3(initScroll,element.position.y,element.position.z),0.05));
        mixer.forEach(mix => mix.update( delta ));

        //const delta = clock.getDelta();

        //if ( mixer ) mixer.update( delta );

		renderer.render( scene, camera );
};

function planes(){
    const texture = new THREE.TextureLoader().load( './models/floor.png' );
    const planegeo = new THREE.PlaneGeometry(10, 10, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
        map: texture
    });
    plane = new THREE.Mesh(planegeo,mat);
    plane.rotation.set(-Math.PI/2 + 0.1,0,0);
    plane.translateY(-8);
    
    plane2 = new THREE.Mesh(planegeo,mat);
    plane2.rotation.set(-Math.PI/2 + 0.1,0,0);
    plane2.translateY(-8);
    plane2.translateX(10);
    
    plane3 = new THREE.Mesh(planegeo,mat);
    plane3.rotation.set(-Math.PI/2 + 0.1,0,0);
    plane3.translateY(-8);
    plane3.translateX(-10);
    //plane.translateX(500)
    scene.add( plane );
    scene.add( plane2 );
    scene.add( plane3 );
}

function createArray(){
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( './models/Daylight_Front.bmp');
    let texture_bk = new THREE.TextureLoader().load( './models/Daylight_Back.bmp');
    let texture_up = new THREE.TextureLoader().load( './models/Daylight_Top.bmp');
    let texture_dn = new THREE.TextureLoader().load( './models/Daylight_Bottom.bmp');
    let texture_rt = new THREE.TextureLoader().load( './models/Daylight_Right.bmp');
    let texture_lf = new THREE.TextureLoader().load( './models/Daylight_Left.bmp');
    
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
   
    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    return materialArray;
}

function skybox(){
    const materialArray = createArray();
    //skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    //skybox = new THREE.Mesh(skyboxGeo, materialArray);
    //scene.add(skybox);
    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const cube = new THREE.Mesh( geometry, materialArray);
    cube.translateY(-9);
    listDynamicModel.push(cube);
    return cube;
}
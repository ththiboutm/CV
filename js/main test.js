import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import * as Loader from './Loader.js'
//import {Vector3} from 'https://cdn.skypack.dev/three@0.135.0';



const clock = new THREE.Clock();
const scene = new THREE.Scene();
var cameraPosition = new THREE.Vector3(0,0,10);
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
let initScroll = 0;
camera.position.set(cameraPosition.x,cameraPosition.y,cameraPosition.z);

var listDynamicModel = new Array();
var planet = new Array();
var astro = new Array();
var texte = new Array();
var skills = new Array();
var prenom = new Array();

var astArray = [
    './models/FBX/Asteroid1.fbx',
    './models/FBX/Asteroid2.fbx'
]
var asteroid = new Array();
var asteroidVel = new Array();
var asteroidRot = new Array();

var pivot = new THREE.Object3D();
scene.add(pivot);
pivot.position.set(0,0,0);
pivot.rotation.set(0,0,1.5);

const raycaster = new THREE.Raycaster();

var isZoomed = false
var isHover = false;
var objectHover;
var scaling = 1.1;

const pointer = new THREE.Vector2();


var renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

renderer.render(scene, camera);

scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );
var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1);
light.position.set(0, 10, -1)
scene.add( light );

//-----------------------------------------------------------------------------LOADING MODELS
Loader.LoadAsyncModelFBX(scene,'./models/FBX/Planet1.fbx',1.2,new THREE.Vector3(0,0,0),new THREE.Vector3(-3,2,0),planet);
Loader.LoadAsyncModelFBX(scene,'./models/FBX/Planet3.fbx',1.2,new THREE.Vector3(0,0,0),new THREE.Vector3(3,-2,0),planet);
Loader.LoadAsyncModelFBX(scene,'./models/FBX/Moon.fbx',1.2,new THREE.Vector3(0,0,0),new THREE.Vector3(-3,-2,0),planet);
Loader.LoadAsyncModelFBX(scene,'./models/FBX/Planet2.fbx',1.2,new THREE.Vector3(0,0,0),new THREE.Vector3(3,2,0),planet);
Loader.LoadAsyncModelFBX(scene,'./models/FBX/astro.fbx',1.2,new THREE.Vector3(-90,0,0),new THREE.Vector3(0,0,0),astro, pivot);
Loader.LoadImage(scene,'./models/Texte/prenom.png', 1.7, new THREE.Vector3(0,0,0), prenom)
loadAsteroid(25);

//-----------------------------------------------------------------------------LOADING MAIN TEXTES
Loader.LoadImage(scene,'./models/Texte/Etudes.png', 0.5, new THREE.Vector3(-2.75,1.83,1), texte)
Loader.LoadImage(scene,'./models/Texte/Experiences.png', 0.75, new THREE.Vector3(2.75,1.83,1), texte)
Loader.LoadImage(scene,'./models/Texte/Competences.png', 0.75, new THREE.Vector3(-2.75,-1.83,1), texte)
Loader.LoadImage(scene,'./models/Texte/Divers.png', 0.5, new THREE.Vector3(2.75,-1.83,1), texte)

//-----------------------------------------------------------------------------LOADING SKILLS TEXTES
Loader.LoadImage(scene,'./models/Texte/Master.png', 1, new THREE.Vector3(-4.2,2.5,0), skills)
Loader.LoadImage(scene,'./models/Texte/Licence.png', 1, new THREE.Vector3(-1.7,2,0), skills)
Loader.LoadImage(scene,'./models/Texte/IUT.png', 1, new THREE.Vector3(-4.2,1.5,0), skills)

Loader.LoadImage(scene,'./models/Texte/Stagiaire.png', 0.75, new THREE.Vector3(2,2,1), skills)
Loader.LoadImage(scene,'./models/Texte/Animateur.png', 0.75, new THREE.Vector3(4,2,1), skills)

Loader.LoadImage(scene,'./models/Texte/langue.png', 0.75, new THREE.Vector3(4,-2.3,1), skills)
Loader.LoadImage(scene,'./models/Texte/bad.png', 0.75, new THREE.Vector3(4,-1.7,1), skills)
Loader.LoadImage(scene,'./models/Texte/vice.png', 0.5, new THREE.Vector3(2,-2.3,1), skills)
Loader.LoadImage(scene,'./models/Texte/charge.png', 0.75, new THREE.Vector3(2,-1.7,1), skills)

Loader.LoadImage(scene,'./models/Image/c.png', 0.25, new THREE.Vector3(-1.8,-2,1), skills)
Loader.LoadImage(scene,'./models/Image/c++.png', 0.25, new THREE.Vector3(-2.2,-1.5,1), skills)
Loader.LoadImage(scene,'./models/Image/java.png', 0.25, new THREE.Vector3(-2.2,-2.5,1), skills)
Loader.LoadImage(scene,'./models/Image/python.png', 0.25, new THREE.Vector3(-3,-2.7,1), skills)
Loader.LoadImage(scene,'./models/Image/sql.png', 0.25, new THREE.Vector3(-3,-1.3,1), skills)
Loader.LoadImage(scene,'./models/Image/tensorflow.png', 0.3, new THREE.Vector3(-4.2,-2,1), skills)
Loader.LoadImage(scene,'./models/Image/scikit.png', 0.25, new THREE.Vector3(-3.8,-2.5,1), skills)
Loader.LoadImage(scene,'./models/Image/keras.png', 0.25, new THREE.Vector3(-3.8,-1.5,1), skills)
Loader.LoadImage(scene,'./models/Image/opencv.png', 0.25, new THREE.Vector3(-3.7,-2,1), skills)


enableSkills();

const sky = skybox();
scene.add(sky);

animate();

//-----------------------------------------------------------------------------LISTENER

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener( 'pointermove', (e) => {
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
})

window.addEventListener('click', (e) => {
    if(isZoomed){
        cameraPosition = new THREE.Vector3(0,0,10);
        isZoomed = false
        enableText();
        enableSkills()
    }
    else
        detectZoom();
})


//-----------------------------------------------------------------------------FUNCTION

function animate() {
    camera.position.lerp(cameraPosition,0.05);
	requestAnimationFrame( animate );
        //initPivot();
        const spin = 0.01;
        const delta = clock.getDelta();
	    sky.rotation.y += 0.00001;

        for(const p of planet){
            p.rotation.y -= 0.001;
        }

        if(prenom.length>0 && !isZoomed){
            prenom[0].material.rotation = Math.atan2(pointer.y, pointer.x) - toRadians(90)
            pivot.rotation.z = Math.atan2(pointer.y, pointer.x) - toRadians(90)
        }
        
        animSkills()
        animAsteroid()

        if(!isZoomed)
            detectHover();

		renderer.render( scene, camera );
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function animSkills(){
    const time = clock.getElapsedTime();
    for(const t of skills){
        t.position.y += Math.cos( time ) * 0.0002;
    } 
}

function animAsteroid(){
    var speed=0.005
    for(let i=0; i < asteroid.length; i++){
        var ast = asteroid[i]
        var vel = asteroidVel[i]
        var rot = asteroidRot[i]

        ast.position.x += vel.x * speed
        ast.position.y += vel.y * speed

        ast.rotateX(rot.x * speed)
        ast.rotateY(rot.y * speed)
        ast.rotateZ(rot.z * speed)

        if(ast.position.x > 8.5 || ast.position.x < -8.5){
            vel.x *= -1
        }

        if(ast.position.y > 4.25 || ast.position.y < -4.25){
            vel.y *= -1
        }
    }
}

function enableText(){
    for(const t of texte){
        t.visible = !t.visible
    }
}

function enableSkills(){
    for(const t of skills){
        t.visible = !t.visible
    }
}

function detectZoom(){
    raycaster.setFromCamera( pointer, camera );
    let intersects = raycaster.intersectObjects( planet );
    if ( intersects.length > 0 ) {
        var clickedObj = checkParentInList(intersects[0]);
        zoom(clickedObj);
    }
    else{
        cameraPosition.set(0,0,10);
    }
}

function zoom(object){
    isZoomed=true
    var fov = camera.fov * ( Math.PI / 180 ); 
    var size = new THREE.Vector3();
    var pos = new THREE.Vector3();
    var box1 = new THREE.Box3().setFromObject( object )
	box1.getSize(size);
	box1.getCenter(pos);
    pos.z = 10
    pos.z = Math.abs( size.y / Math.sin( fov / 2) );
    cameraPosition = pos
    enableText();
    enableSkills();
}

function detectHover(){
    raycaster.setFromCamera( pointer, camera );
    let intersects = raycaster.intersectObjects( planet );
    if ( intersects.length > 0 ) {
        
        objectHover = checkParentInList(intersects[0]);
        if(!isZoomed)
        hover(objectHover);
    }
    else{
        if (objectHover !== undefined) {
            objectHover.scale.set(objectHover.scale.x / scaling,objectHover.scale.y / scaling,objectHover.scale.z / scaling)
            objectHover = undefined
        }
        isHover = false;
    }
}

function hover(obj){
    if(!isHover){
        obj.scale.set(obj.scale.x * scaling,obj.scale.y * scaling,obj.scale.z * scaling)
        isHover = true;
    }
}

function checkParentInList(objchild){
	if(objchild === undefined)
		return
	var current = objchild.object
	while(current.parent.parent!==null){
		current = current.parent
	}
	return(current)
}

function loadAsteroid(number){
    for(let i=0;i<number;i++){
        Loader.LoadAsyncModelFBX(scene,astArray[Math.floor(Math.random()*astArray.length)],0.5,new THREE.Vector3(0,0,0),new THREE.Vector3(randomFromVal(8.5),randomFromVal(4.25),-2),asteroid);
        asteroidVel.push(new THREE.Vector2(randomFromVal(1),randomFromVal(1)))
        asteroidRot.push(new THREE.Vector3(randomFromVal(1),randomFromVal(1),randomFromVal(1)))
    }
}

function randomFromVal(val) {
    return (Math.random() * 2 * val) - val
}

function createArray(){
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( './models/skybox/front.png');
    let texture_bk = new THREE.TextureLoader().load( './models/skybox/back.png');
    let texture_up = new THREE.TextureLoader().load( './models/skybox/top.png');
    let texture_dn = new THREE.TextureLoader().load( './models/skybox/bottom.png');
    let texture_rt = new THREE.TextureLoader().load( './models/skybox/right.png');
    let texture_lf = new THREE.TextureLoader().load( './models/skybox/left.png');
    
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
    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const cube = new THREE.Mesh( geometry, materialArray);
    cube.translateY(-9);
    listDynamicModel.push(cube);
    return cube;
}
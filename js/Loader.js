import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader, SpriteMaterial, Sprite, Box3, Vector3,} from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js';

const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);
const objLoader = new OBJLoader(loadingManager);
const fbxLoader = new FBXLoader(loadingManager);

loadingManager.onLoad = function(){
    document.getElementById("Loading").hidden = true;
}

export function LoadAsyncModelGLTF(scene, path, size,rotation,translation,listModel,name,visible=true){

    gltfLoader.load(
        path,function ( gltf ) {
            
            listModel.push(gltf.scene);
            var box = new Box3().setFromObject( gltf.scene );
            var bbSize = new Vector3();
            var center = new Vector3();
            box.getSize(bbSize);

            
            //box.position.set(0,0,0)
            var ratio = bbSize.y/size;

            gltf.scene.position.set(translation.x,translation.y,translation.z);
            gltf.scene.rotation.x = rotation.x * Math.PI/180;
            gltf.scene.rotation.y = rotation.y * Math.PI/180;
            gltf.scene.rotation.z = rotation.z * Math.PI/180;
            gltf.scene.scale.set(1/ratio, 1/ratio, 1/ratio);
            
            
            gltf.scene.traverse( function( node ) {

                if ( node.isMesh ) { 
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.geometry.computeVertexNormals();
                }
        
            } );
            gltf.scene.visible=visible;
            gltf.scene.name = name;
            scene.add(gltf.scene)
                
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
        }
    );


}

export function LoadAsyncModelFBXAnimate(scene, path, size, rotation, translation, mixer, listModel){
    fbxLoader.load( path, function ( object ) {
        listModel.push(object);
        var box = new Box3().setFromObject( object );
        var bbSize = new Vector3();
        box.getSize(bbSize);
        var ratio = bbSize.y/size;
    
        object.scale.set(1/ratio, 1/ratio, 1/ratio);
        object.rotation.y = rotation * Math.PI/180;
        object.position.set(translation.x,translation.y,translation.z);
        let mix = new THREE.AnimationMixer( object );
        mixer.push(mix);
        const action = mix.clipAction( object.animations[ 0 ] );
        action.play();
    
        object.traverse( function ( child ) {
    
            if ( child.isMesh ) {
    
                child.castShadow = true;
                child.receiveShadow = true;
    
            }
    
            } );
        scene.add( object );
    } );
}


export function LoadMeFBXAnimate(scene, path, size, rotation, translation, mixer, listModel, visible=true){
    fbxLoader.load( path, function ( object ) {
        listModel.push(object);
        var box = new Box3().setFromObject( object );
        var bbSize = new Vector3();
        box.getSize(bbSize);
        var ratio = bbSize.y/size;
    
        object.scale.set(1/ratio, 1/ratio, 1/ratio);
        object.rotation.x = rotation.x * Math.PI/180;
        object.rotation.y = rotation.y * Math.PI/180;
        object.rotation.z = rotation.z * Math.PI/180;
        object.position.set(translation.x,translation.y,translation.z);
        let mix = new THREE.AnimationMixer( object );
        mixer.push(mix);
        const action = mix.clipAction( object.animations[ 0 ] );
        action.play();
        object.visible=visible;
        object.traverse( function ( child ) {
    
            if ( child.isMesh ) {
    
                child.castShadow = true;
                child.receiveShadow = true;
    
            }
    
            } );
        scene.add( object );
    } );
}

export function LoadAsyncModelFBX(scene, path, size, rotation, translation, listModel,parent=null,name='',texture=null){
    fbxLoader.load( path, function ( object ) {
        listModel.push(object);
        var box = new Box3().setFromObject( object );
        var c = new THREE.Vector3()
        box.getCenter(c);

        var bbSize = new Vector3();
        box.getSize(bbSize);
        object.position.set(-c.x, bbSize.y / 2 -c.y, -c.z)
        var ratio = bbSize.y/size;
    
        object.scale.set(1/ratio, 1/ratio, 1/ratio);
        object.rotation.x = rotation.x * Math.PI/180;
        object.rotation.y = rotation.y * Math.PI/180;
        object.rotation.z = rotation.z * Math.PI/180;
        object.position.set(translation.x,translation.y,translation.z);
        object.name = name;
        object.traverse( function ( child ) {
            
            if ( child.isMesh ) {
    
                child.castShadow = true;
                child.receiveShadow = true;
                if(texture) child.material.map = texture;
            }
    
            } );
        if(parent !== null){
            parent.add(object)
        }
        else{
            scene.add( object );
        }
    } );
}

export function LoadAsyncPlanetModelFBX(scene, path, size, rotation, translation, listModel,texture=null){
    fbxLoader.load( path, function ( object ) {
        listModel.push(object);
        var box = new Box3().setFromObject( object );
        var bbSize = new Vector3();
        box.getSize(bbSize);
        var ratio = bbSize.y/size;
    
        //object.scale.set(1/ratio, 1/ratio, 1/ratio);
        object.rotation.y = rotation * Math.PI/180;
        object.position.set(translation.x,translation.y,translation.z);
    
        object.traverse( function ( child ) {
    
            if ( child.isMesh ) {
    
                child.castShadow = true;
                child.receiveShadow = true;
                if(texture) child.material.map = texture;
            }
    
            } );
        scene.add( object );
    } );
}

export function LoadAsyncModelOBJ(scene, path, size, rotation, translation, listModel,texture=null){
    objLoader.load( path, function ( object ) {
        listModel.push(object);
        var box = new Box3().setFromObject( object );
        var bbSize = new Vector3();
        box.getSize(bbSize);
        var ratio = bbSize.y/size;
    
        object.scale.set(1/ratio, 1/ratio, 1/ratio);
        object.rotation.y = rotation * Math.PI/180;
        object.position.set(translation.x,translation.y,translation.z);
    
        object.traverse( function ( child ) {
    
            if ( child.isMesh ) {
    
                child.castShadow = true;
                child.receiveShadow = true;
                if(texture) child.material.map = texture;
            }
    
            } );
        scene.add( object );
    } );
}

export async function LoadImage(scene, path, size, translation, listModel, parent=null){
    const map = new TextureLoader().load( path );
    const material = new SpriteMaterial( { map: map } );
    const sprite = new Sprite( material );
    listModel.push(sprite);

    var box = new Box3().setFromObject( sprite );
    var bbSize = new Vector3();
    box.getSize(bbSize);

    var ratio = bbSize.y/size;

    sprite.scale.set(1/ratio, 1/ratio)
    sprite.position.set(translation.x,translation.y,translation.z);
    sprite.castShadow = true;
    sprite.receiveShadow = true;
    
    if(parent !== null){
        parent.add(sprite)
    }
    else{
        scene.add( sprite );
    }
}
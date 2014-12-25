var windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;
var camera, renderer, scene;
var group;
var clock = new THREE.Clock();

var bInitTimeObject = false;
window.onload = function() {
    console.log("onload");
    Init();
    animate();
};


var uniforms;


function Init() {

    uniforms = {
        time: {
            type: "f",
            value: 1.0
        },
        surface: {
            type: "t",
            value: new THREE.ImageUtils.loadTexture('resource/sun.jpg')
        }
    };
  
    scene = new THREE.Scene();
    group = new THREE.Object3D();

    //setup camera
    camera = new LeiaCamera({
        cameraPosition: new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z),
        targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
    });
    scene.add(camera);

    //setup rendering parameter
    renderer = new LeiaWebGLRenderer({
        antialias: true,
        renderMode: _renderMode,
        shaderMode: _nShaderMode,
        colorMode: _colorMode,
        devicePixelRatio: 1
    });
      renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.Leia_setSize(windowWidth, 0.75 * windowWidth);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement);

    //add object to Scene
    addObjectsToScene();

    //add Light
    addLights();
}

function animate() {
    requestAnimationFrame(animate);
    //   uniforms.noise.value = Math.random();
    var delta = 0.5 * clock.getDelta();

    uniforms.time.value += 0.2 * delta;

    renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));

    renderer.Leia_render({
        scene: scene,
        camera: camera,
        holoScreenSize: _holoScreenSize,
        holoCamFov: _camFov,
        upclip: _up,
        downclip: _down,
        messageFlag: _messageFlag
    });
}

function UpateTimeObject() {
    if (bInitTimeObject === true) {
        scene.remove(group);
        group = new THREE.Object3D();

        // console.log("remove");
    }
    bInitTimeObject = true;
  
    var shaderMaterial = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('sunSurfaceVertexShader').textContent,
        fragmentShader: document.getElementById('sunSurfaceFragmentShader').textContent

    });
  
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(17.5, 100, 100), shaderMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    group.add(sphere);

    scene.add(group);
}

function addObjectsToScene() {
    //Add your objects here
    UpateTimeObject();
    LEIA_setBackgroundPlane('resource/brickwall_900x600_small.jpg');
}

function addLights() {
    //Add Lights Here
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 60, 60);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 512;
    light.shadowDarkness = 0.7;
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
}

function LEIA_setBackgroundPlane(filename, aspect) {



    var foregroundPlaneTexture = new THREE.ImageUtils.loadTexture(filename);
    foregroundPlaneTexture.wrapS = foregroundPlaneTexture.wrapT = THREE.RepeatWrapping;
    foregroundPlaneTexture.repeat.set(1, 1);

    //     //
    //     var planeMaterial = shaderMaterial;
        var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
        plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial);
      console.log(plane);
      plane.updateMatrix();
        plane.position.z = -6;
        plane.castShadow = false;
        plane.receiveShadow = true;
        scene.add(plane);
}
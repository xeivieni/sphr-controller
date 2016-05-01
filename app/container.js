var container;
var camera, scene, renderer;

var sphere_object, sphere_material;

var controlsEnabled = false;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

var click = document.createElement("div");
click.id = "click";
click.innerHTML = "<span style='font-size: 40px'>Click to play</span><br/>";

var controls = document.createElement("div");
var text;
var mode = "arrows";
if (mode == "leap"){
    text = click.innerHTML + "Use leap motion to move the ball";
}
else if (mode == "arrows") {
    text = click.innerHTML + "Use arrows to move around";
}
else{
    text = click.innerHTML + "magical move";
}
click.innerHTML = text;

instructions.appendChild(click);

/*TODO :
 * - Correction de bugs :
 *   - OnKeyUp : effet d'inertie
 *   - Gerer plusieurs touches appuyées
 * - Fonctionalités :
 *   - Piloter depuis le leapmotion
 * - Vues :
 *   - Ajouter l'intro et l'animation de chargement
 *   - Ajouter et linker la vue des reglages
 * - Code :
 *   - Serieusement, c'est dégueulasse !!!!
 *
 * */



instructions.addEventListener('click', function (event) {
    instructions.style.display = 'none';
    controlsEnabled = true;
}, false);


var onKeyDown = function (event) {
    if (controlsEnabled == true) {
        switch (event.keyCode) {
            case 38: // up
                move_sphere(-1, 0);
                break;
            case 37: // left
                move_sphere(0, -1);
                break;
            case 37 && 38:
                move_sphere(-1, -1);
                break;
            case 39 && 38:
                move_sphere(-1, 1);
                break;
            case 40: // down
                move_sphere(1, 0);
                break;
            case 37 && 40:
                move_sphere(1, -1);
                break;
            case 39 && 40:
                move_sphere(1, 1);
                break;
            case 39: // right
                move_sphere(0, 1);
                break;
        }
    }
};
var onKeyUp = function (event) {
    if (controlsEnabled == true) {
        switch (event.keyCode) {
            case 38: // up
                break;
            case 37: // left
                break;
            case 40: // down
                break;
            case 39: // right
                break;
        }
    }
};

init();
animate();

function init() {
    // THREE.TransformControls()
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 200, 800);
    //controls = new THREE.PointerLockControls( camera );
    scene = new THREE.Scene();

    scene.add(new THREE.GridHelper(500, 50));

    var texture = new THREE.Texture(generateTexture());
    texture.needsUpdate = true;

    sphere_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 30,
        shading: THREE.SmoothShading,
        map: texture,
        transparent: false
    });

    var sphere_geometry = new THREE.SphereGeometry(50, 32, 16);


    var mesh = new THREE.Mesh(sphere_geometry, sphere_material);
    sphere_object = mesh;
    sphere_object.position.z = 250;
    sphere_object.position.x = 0;
    sphere_object.position.y = 110;
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0x111111));


    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);


    var directionalLight = new THREE.DirectionalLight(/*Math.random() * */ 0xffffff, 0.125);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, (window.innerHeight - 32));
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, (window.innerHeight - 32));
}

function generateTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext('2d');
    var image = context.getImageData(0, 0, 256, 256);
    var x = 0, y = 0;
    for (var i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
        x = j % 256;
        y = x == 0 ? y + 1 : y;
        image.data[i] = 255;
        image.data[i + 1] = 255;
        image.data[i + 2] = 255;
        image.data[i + 3] = Math.floor(x ^ y);
    }
    context.putImageData(image, 0, 0);
    return canvas;
}

function render() {

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function move_sphere(x_direction, z_direction) {
    sphere_object.rotation.x += x_direction;
    sphere_object.position.z += (20 * x_direction);
    sphere_object.rotation.z += z_direction;
    sphere_object.position.x += (10 * z_direction);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}


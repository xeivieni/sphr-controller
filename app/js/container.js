var events = require('events');

var container;
var camera, scene, renderer;

var sphere_object
    , sphere_material;

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

    scene.add(sphere_object);

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


/**
 * Created by clem on 04/05/2016.
 */


var camera, scene, renderer, sphere_object;

var Room = (function () {
    var self = {};

    self.init = function () {
        var container = document.getElementById('container');
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 200, 800);
        scene = new THREE.Scene();

        scene.add(new THREE.GridHelper(500, 50));

        var texture = new THREE.Texture(self.generateTexture());
        texture.needsUpdate = true;

        var sphere_material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 30,
            shading: THREE.SmoothShading,
            map: texture,
            transparent: false
        });

        var sphere_geometry = new THREE.SphereGeometry(50, 32, 16);

        sphere_object = new THREE.Mesh(sphere_geometry, sphere_material);
        sphere_object.position.z = 250;
        sphere_object.position.x = 0;
        sphere_object.position.y = 110;


        scene.add(sphere_object);

        scene.add(new THREE.AmbientLight(0x111111));

        //
        //document.addEventListener('keydown', onKeyDown, false);
        //document.addEventListener('keyup', onKeyUp, false);


        var directionalLight = new THREE.DirectionalLight(/*Math.random() * */ 0xffffff, 0.125);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random() - 0.5;
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        scene.add(directionalLight);

        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', self.onWindowResize, false);
    };


    self.onWindowResize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    self.generateTexture = function () {
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
    };

    self.render = function () {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    };
    return self;
})();


module.exports = Room;
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

        scene.add(new THREE.GridHelper(5000, 50));

        var texture = new THREE.Texture(self.generateTexture());
        texture.needsUpdate = true;

        // TODO : Use config to set ball color
        var sphere_material = new THREE.MeshPhongMaterial({
            color: 0x180fbe,
            emissive: 0x000000,
            specular: 0xffffff,
            shininess: 30,
            shading: THREE.SmoothShading,
            //map: texture,
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
        camera.lookAt(sphere_object.position);
        renderer.render(scene, camera);
    };

    self.move_sphere = function (x_direction, z_direction) {
        // Look at the rotations, they actually depend on the orientation of the ball
        var controls = { x_direction: x_direction, y_direction: z_direction};
        var request = require("request");

        var options = { method: 'POST',
            url: 'http://localhost:8000/controls/',
            headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                'postman-token': '7a1d9906-b700-e653-6444-6328de07f119',
                'cache-control': 'no-cache',
                authorization: 'Basic Y29udHJvbGVyOnBhc3N3b3JkMDE=' },
            form: controls };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
        sphere_object.rotation.x += x_direction;
        sphere_object.position.z += (20 * x_direction);
        sphere_object.rotation.z += -z_direction;
        sphere_object.position.x += (10 * z_direction);
        self.render();
    };

    return self;
})();


module.exports = Room;
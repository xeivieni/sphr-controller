/**
 * Created by clem on 01/05/2016.
 */

var sphere_material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 30,
    shading: THREE.SmoothShading,
    map: texture,
    transparent: false
});

var sphere_geometry = new THREE.SphereGeometry(50, 32, 16);

var mesh = new THREE.Mesh(sphere_geometry, sphere_material);
var sphere_object = mesh;
sphere_object.position.z = 250;
sphere_object.position.x = 0;
sphere_object.position.y = 110;


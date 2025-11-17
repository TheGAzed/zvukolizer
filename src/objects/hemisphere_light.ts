import * as THREE from 'three';

export function hemisphere_light_object() {
    return new THREE.HemisphereLight(0xffffff, 0xff0000);
}
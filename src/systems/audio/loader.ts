import * as THREE from 'three';

export function systems_loader(): THREE.AudioLoader {
    return new THREE.AudioLoader();
}

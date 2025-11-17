import * as THREE from 'three';

export function systems_sound(listener: THREE.AudioListener) {
    return new THREE.Audio(listener);
}

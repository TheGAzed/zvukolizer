import * as THREE from 'three';

export function systems_sound(listener: THREE.AudioListener): THREE.Audio {
    return new THREE.Audio(listener);
}

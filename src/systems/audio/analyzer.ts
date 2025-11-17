import * as THREE from "three";

export function systems_analyzer(sound: THREE.Audio) {
    return new THREE.AudioAnalyser(sound, 256);
}
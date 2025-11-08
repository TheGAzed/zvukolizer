import * as THREE from "three";

export function systems_analyzer(sound) {
    return new THREE.AudioAnalyser(sound, 256);
}
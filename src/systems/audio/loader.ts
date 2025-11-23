import * as THREE from 'three';

export function systems_loader(sound: THREE.Audio, path: string) {
    const loader = new THREE.AudioLoader();
    loader.load(path, function (buffer) {
        sound.setBuffer(buffer);
    });

    return loader;
}
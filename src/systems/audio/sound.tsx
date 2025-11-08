import * as THREE from 'three';

export function systems_sound(listener) {
    const sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/sound/track.mp3', function (buffer) {
        sound.setBuffer(buffer);
        window.addEventListener('click', function () {
            sound.play();
        });
    });

    return sound;
}
import { Media } from "@/utils/device/media";
import * as THREE from "three";
import { systems_listener } from "@/systems/audio/listener";
import { systems_sound } from "@/systems/audio/sound";
import { systems_loader } from "@/systems/audio/loader";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class DemoMedia extends Media {
    public isPlaying: boolean = true;
    public isLooping: boolean = true;

    constructor(listener: THREE.AudioListener) {
        super(listener);
    }

    togglePlay(): void {
        this.getSound().isPlaying ? this.getSound().pause() : this.getSound().play();
        this.isPlaying = this.getSound().isPlaying;
    }

    load(sound: THREE.Audio): THREE.AudioAnalyser {
        systems_loader(sound, "/sound/disorder.mp3");

        sound.setLoop(true);
        sound.loop = true;

        this.isLooping = true;
        this.isPlaying = true;

        return systems_analyzer(sound);
    }

    public audio(listener: THREE.AudioListener): THREE.Audio {
        return systems_sound(listener);
    }
}
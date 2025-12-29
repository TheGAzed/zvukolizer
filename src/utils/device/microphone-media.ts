import * as THREE from "three";

import { Media } from "@/utils/device/media";

import microphone from "@/components/pages/mic.html?raw"
import { Context } from "@/utils/context";
import { Audio, AudioAnalyser } from "three";
import { systems_sound } from "@/systems/audio/sound";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class Microphone extends Media {
    private readonly playAudio: THREE.Audio;
    private readonly stopAudio: THREE.Audio;
    private readonly playAnalyser: THREE.AudioAnalyser;
    private readonly stopAnalyser: THREE.AudioAnalyser;

    private isPlaying: boolean = true;

    constructor(context: Context, sound: THREE.Audio) {
        super(context, sound);

        this.playAudio = sound;
        this.stopAudio = systems_sound(this.getContext().getListener());

        this.playAnalyser = systems_analyzer(this.playAudio);
        this.stopAnalyser = systems_analyzer(this.stopAudio);
    }

    public initializer(): void {
    }

    destructor() {
        this.playAudio.stop();
        this.playAudio.setVolume(0);
        this.playAudio.disconnect();

        this.stopAudio.stop();
        this.stopAudio.setVolume(0);
        this.stopAudio.disconnect();
    }

    getHtmlControls(): string {
        return microphone;
    }

    handleControls(event: Event): void {
        event.preventDefault();
        this.toggle();
    }

    updateHeading(): void {
        document.getElementById("subtitle")!.textContent =
            "[" +
            this.getContext().getVisual().toString().toUpperCase() +
            "] " +
            "MICROPHONE"
    }

    getSound(): Audio {
        return this.isPlaying ? this.playAudio : this.stopAudio;
    }

    getAnalyser(): AudioAnalyser {
        return this.isPlaying ? this.playAnalyser : this.stopAnalyser;
    }

    protected toggle(): void {
        this.isPlaying = !this.isPlaying;
    }
}
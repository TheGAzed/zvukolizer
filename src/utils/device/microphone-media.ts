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

    private isListening: boolean = true;

    constructor(context: Context, sound: THREE.Audio) {
        super(context, sound);

        this.playAudio = sound;
        this.stopAudio = systems_sound(context.getListener());

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

    protected getName(): string {
        return "MICROPHONE";
    }

    getSound(): Audio {
        return this.isListening ? this.playAudio : this.stopAudio;
    }

    getAnalyser(): AudioAnalyser {
        return this.isListening ? this.playAnalyser : this.stopAnalyser;
    }

    protected toggle(): void {
        this.isListening = !this.isListening;
    }
}
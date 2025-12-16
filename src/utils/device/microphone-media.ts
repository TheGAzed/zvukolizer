import * as THREE from "three";

import { Media } from "@/utils/device/media";
import { Audio, AudioAnalyser } from "three";
import { Context } from "@/utils/context";
import { systems_analyzer } from "@/systems/audio/analyzer";

import microphone from "@/components/pages/mic.html?raw"

export class Microphone extends Media {
    private readonly analyser: THREE.AudioAnalyser;
    private readonly sound: THREE.Audio;

    constructor(context: Context, sound: THREE.Audio) {
        super(context);
        this.sound = sound;
        this.analyser = systems_analyzer(sound);
    }

    public initializer(): void {
    }

    getAnalyser(): AudioAnalyser {
        return this.analyser;
    }

    getHtmlControls(): string {
        return microphone;
    }

    getSound(): Audio {
        return this.sound;
    }

    handleControls(event: Event): void {
    }

    updateHeading(): void {
    }

    protected toggle(): void {
        throw new Error("Method not implemented.");
    }
}
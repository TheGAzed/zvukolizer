import * as THREE from "three";

import { Media } from "@/utils/device/media";
import { Audio, AudioAnalyser } from "three";
import { Context } from "@/utils/context";
import { systems_analyzer } from "@/systems/audio/analyzer";
import { systems_sound } from "@/systems/audio/sound";

import microphone from "@/components/pages/mic.html?raw"


export class Microphone extends Media {
    private readonly analyser: THREE.AudioAnalyser;
    private readonly sound: THREE.Audio;

    constructor(context: Context) {
        super();

        this.sound = systems_sound(context.getListener());
        this.analyser = this.initialize();
    }

    private initialize(): AudioAnalyser {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.sound.setMediaStreamSource(stream);
            this.updateHeading();
            this.toggleLoadingScreen();
        });

        return systems_analyzer(this.sound);
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
}
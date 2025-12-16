import * as THREE from "three";

import { Context } from "@/utils/context";
import { Player } from "@/utils/device/player/player";

import { AudioAnalyser } from "three";

import singlePlayer from "@/components/pages/single.html?raw"
import { systems_analyzer } from "@/systems/audio/analyzer";

export abstract class SinglePlayer extends Player {
    private readonly analyser: THREE.AudioAnalyser;
    private readonly sound: THREE.Audio;

    constructor(context: Context, sound: THREE.Audio) {
        super(context);
        this.sound = sound;
        this.analyser = systems_analyzer(sound);
    }

    public getAnalyser(): AudioAnalyser {
        return this.analyser;
    }

    public getSound(): THREE.Audio {
        return this.sound;
    }

    public getHtmlControls(): string {
        return singlePlayer;
    }

    public handleControls(event: Event): void {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;

        if (submitter.name == "play") {
            this.toggle();
        }
    }
}

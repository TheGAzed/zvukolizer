import * as THREE from "three";

import { Context } from "@/utils/context";
import { Player } from "@/utils/device/player/player";

import { systems_sound } from "@/systems/audio/sound";
import { AudioAnalyser } from "three";

import singlePlayer from "@/components/pages/single.html?raw"

export abstract class SinglePlayer extends Player {
    private readonly analyser: THREE.AudioAnalyser;
    private readonly filepath: string;
    private readonly sound: THREE.Audio;

    protected constructor(context: Context, filepath: string) {
        super();

        this.filepath = filepath;
        this.sound = systems_sound(context.getListener());
        this.analyser = this.initAnalyser();
    }

    protected abstract initAnalyser(): THREE.AudioAnalyser;

    public getAnalyser(): AudioAnalyser {
        return this.analyser;
    }

    public getSound(): THREE.Audio {
        return this.sound;
    }

    public getFilepath(): string {
        return this.filepath;
    }

    public getHtmlControls(): string {
        return singlePlayer;
    }

    public handleControls(event: Event): void {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;

        if (submitter.name == "play") {
            this.toggle(submitter);
        }
    }
}

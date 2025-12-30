import * as THREE from "three";
import { Context } from "@/utils/context";
import { systems_analyzer } from "@/systems/audio/analyzer";

export abstract class Media {
    private readonly context: Context;
    private readonly sound: THREE.Audio;
    private readonly analyser: THREE.AudioAnalyser;
    private readonly subtitle: HTMLElement;

    constructor(context: Context, sound: THREE.Audio) {
        this.sound = sound;
        this.context = context;
        this.analyser = systems_analyzer(sound);

        context.getForm().innerHTML = ""; // clear form inner html
        context.getForm().innerHTML = this.getHtmlControls();

        this.subtitle = document.getElementById("subtitle")!;

        this.updateHeading();
    }

    public getContext(): Context {
        return this.context;
    }

    public getSound(): THREE.Audio {
        return this.sound;
    }

    public  getAnalyser(): THREE.AudioAnalyser {
        return this.analyser;
    }

    public destructor(): void {
        this.getSound().stop();
        this.getSound().setVolume(0);
        this.getSound().disconnect();
    };

    public updateHeading(): void {
        const name = this.getName();
        const visual = this.getContext().getVisual().toString().toUpperCase();

        const heading = "[" + visual + "] " + name;
        this.subtitle.textContent = this.subtitle.title = heading;
    }

    public abstract initializer(): void;
    public abstract getHtmlControls(): string;
    public abstract handleControls(event: Event): void;
    protected abstract getName(): string;

    protected abstract toggle(): void;
}

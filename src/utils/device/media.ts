// Matej Dedina - media.ts - Audio input media representation.

import * as THREE from "three";
import { Context } from "@/utils/context";
import { systems_analyzer } from "@/systems/audio/analyzer";

export abstract class Media {
    private readonly context: Context;
    // audio input file
    private readonly sound: THREE.Audio;
    // sound analyser
    private readonly analyser: THREE.AudioAnalyser;
    // subtitle reference for subtitle manipulation
    private readonly subtitle: HTMLElement;

    constructor(context: Context, sound: THREE.Audio) {
        // set context and sound
        this.sound = sound;
        this.context = context;

        // create audio analyser
        this.analyser = systems_analyzer(sound);

        // change form's inner body to media's
        context.getForm().innerHTML = ""; // clear form inner html
        context.getForm().innerHTML = this.getHtmlControls();

        // get subtitle body
        this.subtitle = document.getElementById("subtitle")!;

        this.updateSubtitle(); // update subtitle to sound's name
    }

    /**
     * Gets sound.
     */
    public getSound(): THREE.Audio {
        return this.sound;
    }

    /**
     * Gets audio analyser for visual manipulation.
     */
    public  getAnalyser(): THREE.AudioAnalyser {
        return this.analyser;
    }

    /**
     * Destructor method to call after state has changed to destroy media input.
     */
    public destructor(): void {
        this.getSound().stop();
        this.getSound().setVolume(0);
        this.getSound().disconnect();
    };

    /**
     * Updates subtitle containing visual's and sound's name.
     */
    public updateSubtitle(): void {
        const name = this.getName();
        const visual = this.context.getVisual().toString().toUpperCase();

        const heading = "[" + visual + "] " + name;
        this.subtitle.textContent = this.subtitle.title = heading;
    }

    /**
     * Initialize method to call during state entry to set up media after its construction.
     */
    public abstract initializer(): void;

    /**
     * Get controls HTML component page individual for each media type.
     */
    public abstract getHtmlControls(): string;

    /**
     * Handle form submission.
     * @param event Event that triggered form submit.
     */
    public abstract handleControls(event: Event): void;

    /**
     * Get media's name (can be either song or device).
     * @protected
     */
    protected abstract getName(): string;

    /**
     * Toggle sound play (can be related to playback output and/or microphone input).
     * @protected
     */
    protected abstract toggle(): void;
}

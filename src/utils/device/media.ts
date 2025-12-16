import * as THREE from "three";
import { Context } from "@/utils/context";

export abstract class Media {
    private readonly context: Context;

    constructor(context: Context) {
        this.context = context;
        context.getForm().innerHTML = ""; // clear form inner html
        context.getForm().innerHTML = this.getHtmlControls();
    }

    public getContext(): Context {
        return this.context;
    }

    public abstract initializer(): void;

    public destructor(): void {
        this.getSound().disconnect();
    };

    public abstract getAnalyser(): THREE.AudioAnalyser;
    public abstract getSound(): THREE.Audio;
    public abstract getHtmlControls(): string;
    public abstract handleControls(event: Event): void;
    public abstract updateHeading(): void;

    protected abstract toggle(): void;
}

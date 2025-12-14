import * as THREE from "three";

export abstract class Media {
    protected toggleLoadingScreen(): void {
        const load = document.getElementById("loading-screen")!;
        load.classList.toggle("hidden");
        load.classList.toggle("fixed");
    }

    public abstract getAnalyser(): THREE.AudioAnalyser;
    public abstract getSound(): THREE.Audio;
    public abstract getHtmlControls(): string;
    public abstract handleControls(event: Event): void;
    public abstract updateHeading(): void;
    public abstract destructor(): void;
}

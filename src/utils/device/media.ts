import * as THREE from "three";

export abstract class Media {
    private readonly analyser: THREE.AudioAnalyser;
    private readonly sound: THREE.Audio;

    public isPlaying: boolean = false;
    public isLooping: boolean = false;

    protected constructor(listener: THREE.AudioListener) {
        this.sound = this.audio(listener);
        this.analyser = this.load(this.sound);
    }

    public abstract togglePlay(): void;

    public getAnalyser(): THREE.AudioAnalyser {
        return this.analyser;
    }

    public getSound(): THREE.Audio {
        return this.sound;
    }

    public abstract load(sound: THREE.Audio): THREE.AudioAnalyser;
    public abstract audio(listener: THREE.AudioListener): THREE.Audio;
}
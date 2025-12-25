import { Player } from "@/utils/device/player/player";
import * as THREE from "three";

import multiPlayer from "@/components/pages/multi.html?raw"
import { Context } from "@/utils/context";
import { systems_analyzer } from "@/systems/audio/analyzer";
import { systems_loader } from "@/systems/audio/loader";
import { systems_sound } from "@/systems/audio/sound";

type Song = {
    sound: THREE.Audio;
    analyser: THREE.AudioAnalyser;
}

export class FolderMedia extends Player {
    private readonly songs: Song[];
    private index = 0;

    constructor(context: Context, sound: THREE.Audio, others: File[]) {
        super(context, sound);

        this.songs = [{ sound, analyser: systems_analyzer(sound) }];
        this.play();

        const listener = this.getContext().getListener();
        this.loadFiles(listener, others).then(undefined);
    }

    private async loadFiles(listener: THREE.AudioListener, files: File[]) {
        const loader = systems_loader();

        for (const file of files) {
            await new Promise(requestAnimationFrame);

            const buffer = await loader.loadAsync(URL.createObjectURL(file));
            const audio = systems_sound(listener);
            audio.name = file.name;
            audio.setBuffer(buffer);

            this.songs.push({ sound: audio, analyser: systems_analyzer(audio) });
        }
    }

    protected play(delay?: number) {
        super.play(delay);
        this.getSound().source!.onended = () => { this.next(); };
    }

    getSound(): THREE.Audio {
        return this.songs ? this.songs[this.index].sound : super.getSound();
    }

    getAnalyser(): THREE.AudioAnalyser {
        return this.songs ? this.songs[this.index].analyser : super.getAnalyser();
    }

    getHtmlControls(): string {
        return multiPlayer;
    }

    handleControls(event: Event): void {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;

        switch (submitter.name) {
            case "play":     { this.toggle(); break; }
            case "backward": { this.prev();   break; }
            case "forward":  { this.next();   break; }
        }
    }

    private next(): void {
        this.stop();

        this.getSound().offset = 0;
        this.index = (this.index + 1) % this.songs.length;
        this.resetPlayback();

        this.play();
    }

    private prev(): void {
        this.stop();

        this.getSound().offset = 0;
        this.index = (this.index == 0) ? (this.songs.length - 1) : (this.index - 1);
        this.resetPlayback();

        this.play();
    }
}
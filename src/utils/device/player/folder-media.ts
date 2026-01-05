// Matej Dedina - player-media.ts - Playable folder audio input media representation.

import { PlayerMedia } from "@/utils/device/player/player-media";
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

export class FolderMedia extends PlayerMedia {
    private readonly songs: Song[];
    private index = 0;

    constructor(context: Context, sound: THREE.Audio, others: File[]) {
        super(context, sound);

        this.songs = [{ sound, analyser: systems_analyzer(sound) }];
        this.play();

        const listener = context.getListener();
        this.loadFiles(context, listener, others).then(undefined);
    }

    /**
     * Asynchronously load audio files from folder.
     * @param context Context for error displaying.
     * @param listener Audio listener for each sound class.
     * @param files Array of files to load and save into Song array.
     * @private
     */
    private async loadFiles(context: Context, listener: THREE.AudioListener, files: File[]): Promise<void> {
        const loader = systems_loader();

        // for each file in files array load it into songs
        for (const file of files) {
            await new Promise(requestAnimationFrame); // let app run without this methods interference

            try {
                // load sound asynchronously
                const buffer = await loader.loadAsync(URL.createObjectURL(file));
                const audio = systems_sound(listener);

                // set song's name and buffer
                audio.name = file.name;
                audio.setBuffer(buffer);

                // push song into songs array
                this.songs.push({ sound: audio, analyser: systems_analyzer(audio) });
            } catch (e) {
                context.showError(e);
            }
        }
    }

    protected play(delay?: number) {
        super.play(delay);
        // make sure next song is played after current one finished
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
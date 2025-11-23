import { Media } from "@/utils/device/media";
import * as THREE from "three";
import { systems_listener } from "@/systems/audio/listener";
import { systems_sound } from "@/systems/audio/sound";
import { systems_loader } from "@/systems/audio/loader";
import assert from "node:assert";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class FileMedia extends Media {
    private readonly filepath: string;

    constructor(listener: THREE.AudioListener, filepath: string) {
        super(listener);
        this.filepath = filepath;
    }

    togglePlay(): void {
        this.getSound().isPlaying ? this.getSound().pause() : this.getSound().play();
        this.isPlaying = this.getSound().isPlaying;
    }

    toggleLoop(): void {
        this.isLooping = !this.isLooping;
        this.getSound().setLoop(this.isLooping);
    }

    skipForward(seconds: number): void {
        assert(this.getSound().buffer != null, "Expected audio to be loaded.");

        const newOffset = Math.min(
            Math.max(this.getSound().offset + seconds, 0),
            this.getSound().buffer!.duration
        );

        const wasPlaying = this.getSound().isPlaying;

        this.getSound().stop();
        this.getSound().offset = newOffset;

        if (wasPlaying) {
            this.getSound().play();
        }
    }

    skipBackward(seconds: number) {
        assert(this.getSound().buffer != null, "Expected audio to be loaded.");

        const newOffset = Math.min(
            Math.max(this.getSound().offset - seconds, 0),
            this.getSound().buffer!.duration
        );

        const wasPlaying = this.getSound().isPlaying;

        this.getSound().stop();
        this.getSound().offset = newOffset;

        if (wasPlaying) {
            this.getSound().play();
        }
    }

    load(sound: THREE.Audio): THREE.AudioAnalyser {
        systems_loader(sound, this.filepath);
        sound.setLoop(true);
        sound.play();

        this.isLooping = true;
        this.isPlaying = true;

        return systems_analyzer(sound);
    }

    public audio(listener: THREE.AudioListener): THREE.Audio {
        return systems_sound(listener);
    }
}
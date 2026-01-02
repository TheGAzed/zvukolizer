// Matej Dedina - state.ts - FST states for each input audio media type.

import { Context } from "@/utils/context"

import { Media } from "@/utils/device/media";
import { DemoMedia } from "@/utils/device/player/single/demo-media";
import { FileMedia } from "@/utils/device/player/single/file-media";
import { Microphone } from "@/utils/device/microphone-media";
import { systems_loader } from "@/systems/audio/loader";
import { systems_sound } from "@/systems/audio/sound";

import * as THREE from "three";
import { EmptyMedia } from "@/utils/device/empty-media";
import { FolderMedia } from "@/utils/device/player/folder-media";

interface StateEdges {
    /**
     * Go to demo state.
     */
    onDemo(): void;
    /**
     * Go to file state on file input.
     * @param event Event that triggers file input.
     */
    onFile(event: Event): void;
    /**
     * Go to folder/multi-file state on file input.
     * @param event Event that triggers multi-file input.
     */
    onFolder(event: Event): void;
    /**
     * Go to microphone state.
     */
    onMic(): void;
    /**
     * Go to MIDI device state.
     */
    onMIDI(): void;
}

export abstract class State<M extends Media> implements StateEdges {
    // context to control errors and subtitle change.
    private readonly context: Context;
    // media device associated with concrete state.
    private readonly media: M;

    protected constructor(context: Context, media: M) {
        this.context = context;
        this.media = media;
    }

    onDemo() {
        const loader = systems_loader();
        const sound = systems_sound(this.context.getListener());
        sound.name = "Joy Division - Disorder";

        loader.load("./sound/disorder.mp3", (buffer) => {
            sound.setBuffer(buffer).setLoop(true);

            this.context.setState(new DemoState(this.context, sound));
            this.context.toggleLoading();
        }, undefined, (error) => {
            this.context.showError(error);
        });
    }

    onFile(event: Event): void {
        const input = event.target as HTMLInputElement;

        const file = input.files!.item(0);
        if (!file) return;

        this.context.toggleLoading();

        const sound = systems_sound(this.context.getListener());
        sound.name = file.name;

        const loader = systems_loader();
        loader.load(URL.createObjectURL(file), (buffer) => {
            sound.setBuffer(buffer).setLoop(true);
            input.value = ''; // remove file from input storage

            this.context.setState(new FileState(this.context, sound));
            this.context.toggleLoading();
        }, undefined, (error) => {
            this.context.showError(error);
            this.context.toggleLoading();
        });
    }

    onFolder(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || !input.files.length) return;

        const audioFiles = [...input.files].filter(file => file.type.startsWith("audio/"));
        if (!audioFiles.length) {
            this.context.showError(new Error("No audio files found."));
            return;
        }

        this.context.toggleLoading();

        const file = audioFiles.pop()!;

        const sound = systems_sound(this.context.getListener());
        sound.name = file.name;

        const loader = systems_loader();
        loader.load(URL.createObjectURL(file), (buffer) => {
            sound.setBuffer(buffer);
            input.value = ''; // remove file from input storage

            this.context.setState(new FolderState(this.context, sound, audioFiles));
            this.context.toggleLoading();
        }, undefined, (error) => {
            this.context.showError(error);
            this.context.toggleLoading();
        });
    }

    onMic(): void {
        this.context.toggleLoading();

        const sound = systems_sound(this.context.getListener());
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            sound.setMediaStreamSource(stream);
            sound.name = "Microphone";

            this.context.setState(new MicrophoneState(this.context, sound));
            this.context.toggleLoading();
        }).catch(error => {
            this.context.showError(error);
            this.context.toggleLoading();
        });
    }

    onMIDI(): void {
        this.context.setState(new MIDIState(this.context, systems_sound(this.context.getListener())));
    }

    /**
     * Gets state's media.
     */
    public getMedia(): M {
        return this.media;
    }

    /**
     * Method called on state entry after its construction.
     */
    public entry(): void {
        console.log(this.toString() + " state entry.");
        this.media.initializer();
    }

    /**
     * Method called on state exit after its construction and entry.
     */
    public exit(): void {
        console.log(this.toString() + " state exit.");
        this.media.destructor();
    }

    /**
     * Get string name of concrete state.
     */
    public abstract toString(): string;
}

export class InitialState extends State<EmptyMedia> {
    constructor(context: Context) {
        const media = new EmptyMedia(context);
        super(context, media);
    }

    public toString(): string {
        return "Initial";
    }
}

export class DemoState extends State<DemoMedia> {
    constructor(context: Context, sound: THREE.Audio) {
        const media = new DemoMedia(context, sound);
        super(context, media);
    }

    public toString(): string {
        return "Home";
    }
}

class FileState extends State<FileMedia> {
    constructor(context: Context, sound: THREE.Audio) {
        super(context, new FileMedia(context, sound));
    }

    public toString(): string {
        return "File";
    }
}

class FolderState extends State<DemoMedia> {
    constructor(context: Context, sound: THREE.Audio, others: File[]) {
        const media = new FolderMedia(context, sound, others);
        super(context, media);
    }

    public toString(): string {
        return "Folder";
    }
}

class MicrophoneState extends State<Microphone> {
    constructor(context: Context, sound: THREE.Audio) {
        const media = new Microphone(context, sound);
        super(context, media);
    }

    public toString(): string {
        return "Mic";
    }
}

// TODO: Implement MIDI media state.
class MIDIState extends State<DemoMedia> {
    constructor(context: Context, sound: THREE.Audio) {
        const media = new DemoMedia(context, sound); // not implemented, treat as demo media
        super(context, media);
    }

    public toString(): string {
        return "MIDI";
    }
}

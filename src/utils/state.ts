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
    onDemo(): void;
    onFile(event: Event): void;
    onFolder(event: Event): void;
    onMic(): void;
    onMIDI(): void;
}

export abstract class State<M extends Media> implements StateEdges {
    private readonly context: Context;
    private readonly media: M;

    protected constructor(context: Context, media: M) {
        this.context = context;
        this.media = media;
    }

    onDemo() {
        const loader = systems_loader();
        const sound = systems_sound(this.context.getListener());
        sound.name = "Joy Division - Disorder";

        loader.load("/sound/disorder.mp3", (buffer) => {
            sound.setBuffer(buffer).setLoop(true);

            this.context.setState(new DemoState(this.context, sound));
            this.context.toggleLoading();
        }, undefined, (error) => {
            console.log(error);
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
            console.log(error);
            this.context.toggleLoading();
        });
    }

    onFolder(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || !input.files.length) return;

        this.context.toggleLoading();

        const list: File[] = Array.from(input.files);
        const file = list.pop()!;

        const sound = systems_sound(this.context.getListener());
        sound.name = file.name;

        const loader = systems_loader();
        loader.load(URL.createObjectURL(file), (buffer) => {
            sound.setBuffer(buffer);
            input.value = ''; // remove file from input storage

            this.context.setState(new FolderState(this.context, sound, list));
            this.context.toggleLoading();
        }, undefined, (error) => {
            console.log(error);
            this.context.toggleLoading();
        });
    }

    onMic(): void {
        this.context.toggleLoading();

        const sound = systems_sound(this.context.getListener());
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            sound.setMediaStreamSource(stream);
            this.context.setState(new MicrophoneState(this.context, sound));
            this.context.toggleLoading();
        }).catch(error => {
            console.error(error);
            this.context.toggleLoading();
        });
    }

    onMIDI(): void {
        this.context.setState(new MIDIState(this.context, systems_sound(this.context.getListener())));
    }

    public getMedia(): M {
        return this.media;
    }

    public entry(): void {
        console.log(this.toString() + " state entry.");
        this.media.initializer();
    }

    public exit(): void {
        console.log(this.toString() + " state exit.");
        this.media.destructor();
    }

    public handleForm(event: Event): void {
        this.media.handleControls(event);
    }

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

class MIDIState extends State<DemoMedia> {
    constructor(context: Context, sound: THREE.Audio) {
        const media = new DemoMedia(context, sound);
        super(context, media);
    }

    public toString(): string {
        return "MIDI";
    }
}

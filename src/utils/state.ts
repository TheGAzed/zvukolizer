import { Context } from "@/utils/context"

import { Media } from "@/utils/device/media";
import { DemoMedia } from "@/utils/device/player/single/demo-media";
import { FileMedia } from "@/utils/device/player/single/file-media";

interface StateEdges {
    onFile(event: Event): void;
    onFolder(directory: string): void;
    onMic(): void;
    onMIDI(): void;
}

export abstract class State<M extends Media> implements StateEdges {
    private readonly context: Context;
    private readonly media: M;

    protected constructor(context: Context, media: M) {
        this.context = context;
        this.media = media;

        context.getForm().innerHTML = ""; // clear form inner html
        context.getForm().innerHTML = media.getHtmlControls();
    }

    onFile(event: Event): void {
        const input = event.target as HTMLInputElement;

        const file = input.files!.item(0);
        if (!file) return;

        this.context.setState(new FileState(this.context, file));
    }

    onFolder(directory: string): void {
        this.context.setState(new FolderState(this.context));
    }

    onMic(): void {
        this.context.setState(new MicrophoneState(this.context));
    }

    onMIDI(): void {
        this.context.setState(new MIDIState(this.context));
    }

    public getMedia(): M {
        return this.media;
    }

    public entry(): void {
        console.log(this.toString() + " state entry.");
    }

    public exit(): void {
        console.log(this.toString() + " state exit.");

        const load = document.getElementById("loading-screen")!;
        load.classList.toggle("hidden");
        load.classList.toggle("fixed");

        this.media.destructor();
    }

    public handleForm(event: Event): void {
        this.media.handleControls(event);
    }

    public abstract toString(): string;
}

export class DemoState extends State<DemoMedia> {
    constructor(context: Context) {
        const media = new DemoMedia(context);
        super(context, media);
    }

    public toString(): string {
        return "Home";
    }

    override entry(): void {
        super.entry();
    }

    override exit(): void {
        super.exit();
    }
}

class FileState extends State<FileMedia> {
    constructor(context: Context, file: File) {
        super(context, new FileMedia(context, file));
    }

    public toString(): string {
        return "File";
    }

    override entry(): void {
        super.entry();
    }

    override exit(): void {
        super.exit();
    }
}

class FolderState extends State<DemoMedia> {
    constructor(context: Context) {
        const media = new DemoMedia(context);
        super(context, media);
    }

    public toString(): string {
        return "Folder";
    }

    override entry(): void {
        super.entry();
        console.log("Folder state exit.");
    }

    override exit(): void {
        super.exit();
        console.log("Folder state exit.");
    }
}

class MicrophoneState extends State<DemoMedia> {
    constructor(context: Context) {
        const media = new DemoMedia(context);
        super(context, media);
    }

    public toString(): string {
        return "Mic";
    }

    override entry(): void {
        super.entry();
        console.log("Mic state exit.");
    }

    override exit(): void {
        super.exit();
        console.log("Mic state exit.");
    }
}

class MIDIState extends State<DemoMedia> {
    constructor(context: Context) {
        const media = new DemoMedia(context);
        super(context, media);
    }

    public toString(): string {
        return "MIDI";
    }

    override entry(): void {
        super.entry();
        console.log("MIDI state exit.");
    }

    override exit(): void {
        super.exit();
        console.log("MIDI state exit.");
    }
}

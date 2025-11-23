import * as THREE from "three";
import { Media } from "@/utils/device/media";
import { DemoMedia } from "@/utils/device/demo-media";
import { FileMedia } from "@/utils/device/file-media";
import { Visual } from "@/objects/visual";
import { Gaia } from "@/objects/gaia";

abstract class State<M extends Media> {
    protected context: Context;
    public media: M;

    constructor(context: Context, media: M) {
        this.context = context;
        this.media = media;
    }

    public abstract onHome(): void;
    public abstract onFile(filepath: string): void;
    public abstract onFolder(directory: string): void;
    public abstract onMic(): void;
    public abstract onMIDI(): void;

    public abstract entry(): void;
    public abstract exit(): void;
}

export class HomeState extends State<DemoMedia> {
    constructor(context: Context, media: DemoMedia) {
        super(context, media);
    }

    public onHome(): void {
    }

    public onFile(filepath: string): void {
        const listener = this.context.getListener();
        this.context.setState(new FileState(this.context, new FileMedia(listener, filepath)));
    }

    public onFolder(directory: string): void {
    }

    public onMic(): void {
    }

    public onMIDI(): void {
    }

    public entry(): void {
        console.log("Home state entry.");

        const form = document.getElementById("main-form")!;
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            this.context.getState().media.togglePlay();

            const submitter = (e as SubmitEvent).submitter as HTMLElement;
            const useEl = submitter.querySelector("use") as SVGUseElement | null;
            if (!useEl) return;

            const current = useEl.getAttribute("xlink:href");
            useEl.setAttribute("xlink:href", current === "/icons/play.svg" ? "/icons/pause.svg" : "/icons/play.svg");
        });

        document.getElementById("loading-screen")?.remove();
    }

    public exit(): void {
        console.log("Home state exit.");
    }
}

class FileState extends State<FileMedia> {
    constructor(context: Context, media: FileMedia) {
        super(context, media);
    }

    public onHome(): void {
        const listener = this.context.getListener();
        this.context.setState(new HomeState(this.context, new DemoMedia(listener)));
    }

    public onFile(filepath: string): void {
    }

    public onFolder(): void {
    }

    public onMic(): void {
    }

    public onMIDI(): void {
    }

    public entry(): void {
        console.log("Home state entry.");
    }

    public exit(): void {
        console.log("Home state exit.");
    }
}

class FolderState extends State<DemoMedia> {
    public onHome(): void {
    }

    public onFile(filepath: string): void {
    }

    public onFolder(): void {
    }

    public onMic(): void {
    }

    public onMIDI(): void {
    }

    public entry(): void {
        console.log("Home state entry.");
    }

    public exit(): void {
        console.log("Home state exit.");
    }
}

class MicState extends State<DemoMedia> {
    public onHome(): void {
    }

    public onFile(filepath: string): void {
    }

    public onFolder(): void {
    }

    public onMic(): void {
    }

    public onMIDI(): void {
    }

    public entry(): void {
        console.log("Home state entry.");
    }

    public exit(): void {
        console.log("Home state exit.");
    }
}

class MIDIState extends State<DemoMedia> {
    public onHome(): void {
    }

    public onFile(filepath: string): void {
    }

    public onFolder(): void {
    }

    public onMic(): void {
    }

    public onMIDI(): void {
    }

    public entry(): void {
        console.log("Home state entry.");
    }

    public exit(): void {
        console.log("Home state exit.");
    }
}

export class Context {
    private state: State<Media>;
    private readonly visuals: Array<new (...args: any[]) => Visual>;
    private index: number = 0;
    private readonly listener: THREE.AudioListener;
    private renderer: THREE.WebGLRenderer;

    constructor(renderer: THREE.WebGLRenderer, listener: THREE.AudioListener) {
        this.listener = listener;
        this.renderer = renderer;
        this.state = new HomeState(this, new DemoMedia(this.listener));
        this.state.entry();

        this.visuals = [
            Gaia,
        ];
    }

    public setState(state: State<Media>) {
        this.state.exit();
        this.state = state;
        this.state.entry();
    }

    public getState(): State<Media> {
        return this.state;
    }

    public getListener(): THREE.AudioListener {
        return this.listener;
    }

    public nextVisual() {
        this.index = this.index + 1 % this.visuals.length;
    }

    public prevVisual() {
        this.index = this.index == 0 ? this.visuals.length - 1 : this.index - 1;
    }

    public getVisual(): Visual {
        return new this.visuals[this.index](this.renderer, this.state.media);
    }
}

import * as THREE from "three";
import { Visual } from "@/objects/visual";
import { Media } from "@/utils/device/media";
import { systems_listener } from "@/systems/audio/listener";
import { core_renderer } from "@/core/renderer";
import { Gaia } from "@/objects/gaia";
import { DemoState, State } from "@/utils/state";
import { Pontus } from "@/objects/pontus";
import { systems_sound } from "@/systems/audio/sound";
import { systems_loader } from "@/systems/audio/loader";

export class Context {
    private readonly listener: THREE.AudioListener; // audio listener
    private readonly visuals: Visual[]; // array of implemented visualisers
    private readonly renderer: THREE.WebGLRenderer; // main and only renderer
    private readonly form: HTMLFormElement; // controls form

    private state: State<Media>; // current state
    private index: number = 0; // index fo currently active visualiser

    constructor() {
        // get form of audio controls
        this.form = document.getElementsByTagName("form").item(0)!;

        this.listener = systems_listener(); // generate single systems audio listener
        this.renderer = core_renderer(); // create core renderer

        // add implemented visualisers
        this.visuals = [
            new Pontus(this),
            new Gaia(this),
        ];

        const sound = systems_sound(this.listener);
        sound.name = "Joy Division - Disorder";

        this.state = new DemoState(this, sound); // set demo state as initial state
        this.state.entry();

        const loader = systems_loader();
        loader.load("/sound/disorder.mp3", (buffer) => {
            sound.setBuffer(buffer).setLoop(true);
            this.state.getMedia().initializer();

            this.toggleLoading();
        });

        (window as any).context = this; // make this context available globally for index.html
    }

    public getForm() {
        return this.form;
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        const object = this.getVisual();
        object.animate();

        this.renderer.render(object.getScene(), object.getCamera());
    }

    public getVisual(): Visual {
        return this.visuals[this.index];
    }

    public setState(state: State<Media>) {
        this.state.exit();
        console.log("here")
        this.state = state;
        this.state.entry();
    }

    public getState(): State<Media> {
        return this.state;
    }

    public getListener(): THREE.AudioListener {
        return this.listener;
    }

    public nextVisual(): void {
        this.index = (this.index + 1) % this.visuals.length;
        this.state.getMedia().updateHeading();
    }

    public prevVisual(): void {
        this.index = this.index == 0 ? this.visuals.length - 1 : this.index - 1;
        this.state.getMedia().updateHeading();
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    public toggleLoading(): void {
        const load = document.getElementById("loading-screen")!;
        load.classList.toggle("hidden");
        load.classList.toggle("fixed");
    }
}

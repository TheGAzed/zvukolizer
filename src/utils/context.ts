import * as THREE from "three";
import { Visual } from "@/objects/visual";
import { Media } from "@/utils/device/media";
import { systems_listener } from "@/systems/audio/listener";
import { core_renderer } from "@/core/renderer";
import { Gaia } from "@/objects/gaia";
import { DemoState, State } from "@/utils/state";
import { Tartarus } from "@/objects/tartarus";

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
        this.state = new DemoState(this); // set demo state as initial state

        this.renderer = core_renderer(); // create core renderer

        // add implemented visualisers
        this.visuals = [
            new Tartarus(this),
            new Gaia(this),
        ];

        this.state.entry(); // enter initial state

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
}

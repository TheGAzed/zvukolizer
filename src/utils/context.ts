import * as THREE from "three";
import { Visual } from "@/objects/visual";
import { Media } from "@/utils/device/media";
import { systems_listener } from "@/systems/audio/listener";
import { core_renderer } from "@/core/renderer";
import { Gaia } from "@/objects/gaia";
import { InitialState, State } from "@/utils/state";
import { Pontus } from "@/objects/pontus";
import { Eros } from "@/objects/eros";
import { Tartarus } from "@/objects/tartarus";
import Stats from 'stats.js'

export class Context {
    private readonly listener: THREE.AudioListener; // audio listener
    private readonly visuals: Visual[]; // array of implemented visualisers
    private readonly renderer: THREE.WebGLRenderer; // main and only renderer
    private readonly form: HTMLFormElement; // controls form
    private state: State<Media>; // current state
    private stats = new Stats();
    private readonly error: HTMLElement;

    constructor() {
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        //document.body.appendChild(this.stats.dom)

        // get form of audio controls
        this.form = document.getElementsByTagName("form").item(0)!;
        this.error = document.getElementById("error")!;

        this.listener = systems_listener(); // generate single systems audio listener
        this.renderer = core_renderer(); // create core renderer

        // add implemented visualisers
        this.visuals = [
            new Gaia(this),
            new Pontus(this),
            new Eros(this),
            new Tartarus(this),
        ];

        this.state = new InitialState(this);
        this.state.entry();
        this.state.onDemo();

        (window as any).context = this; // make this context available globally for index.html
    }

    public getForm() {
        return this.form;
    }

    public animate(): void {
        this.stats.begin();

        const object = this.getVisual();
        object.animate();

        this.renderer.render(object.getScene(), object.getCamera());

        this.stats.end();

        requestAnimationFrame(() => this.animate());
    }

    public getVisual(): Visual {
        return this.visuals[0];
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
        this.visuals.push(<Visual>this.visuals.shift());
    }

    public prevVisual(): void {
        this.visuals.unshift(<Visual>this.visuals.pop());
    }

    public toggleLoading(): void {
        const load = document.getElementById("loading-screen")!;
        load.classList.toggle("hidden");
        load.classList.toggle("fixed");
    }

    public showError(error: unknown | any) {
        if (error instanceof Error) {
            this.error.classList.remove("hidden");
            this.error.classList.add("flex");
            this.error.title = this.error.children[1].innerHTML = error.message;
        }
        console.log(error);

        setTimeout(() => {
            this.error.classList.remove("flex");
            this.error.classList.add("hidden");
            this.error.title = this.error.children[1].innerHTML = "";
        }, 4000);
    }
}

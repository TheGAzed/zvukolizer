import * as THREE from "three";
import { Visual } from "@/objects/visual";
import { Media } from "@/utils/device/media";
import { systems_listener } from "@/systems/audio/listener";
import { core_renderer } from "@/core/renderer";
import { Gaia } from "@/objects/gaia";
import { DemoState, State } from "@/utils/state";

export class Context {
    private readonly listener: THREE.AudioListener;
    private readonly visuals: Visual[];
    private readonly renderer: THREE.WebGLRenderer;
    private readonly submit: HTMLFormElement;

    private state: State<Media>;
    private index: number = 0;

    constructor() {
        this.submit = document.getElementsByTagName("form").item(0)!;
        this.listener = systems_listener();
        this.state = new DemoState(this);

        this.renderer = core_renderer();

        this.visuals = [
            new Gaia(this.renderer, this),
        ];

        this.state.entry();

        (window as any).context = this;
    }

    public getSubmit() {
        return this.submit;
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        const object = this.visuals[this.index];
        object.animate();

        this.renderer.render(object.scene, object.camera);
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
        this.index = (this.index + 1) % this.visuals.length;
    }

    public prevVisual() {
        this.index = this.index == 0 ? this.visuals.length - 1 : this.index - 1;
    }
}

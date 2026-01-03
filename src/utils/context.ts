// Matej Dedina - context.ts - Context superclass able to manipulate entire application.

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

import Stats from 'three/examples/jsm/libs/stats.module.js';

export class Context {
    private readonly listener: THREE.AudioListener;
    // Array of implemented visualisers.
    private readonly visuals: Visual[];
    private readonly renderer: THREE.WebGLRenderer;
    // Formular controls body to change based on media.
    private readonly form: HTMLFormElement;
    // Current FSM's state based on state pattern.
    private state: State<Media>;
    // Error body to display errors.
    private readonly error: HTMLElement;

    private readonly stats: Stats = new Stats();

    constructor() {
        this.stats.showPanel(0);
        //document.body.appendChild(this.stats.dom);

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

        // set initial 'empty-state' that instantly goes to demo state
        this.state = new InitialState(this);
        this.state.entry();
        this.state.onDemo();

        (window as any).context = this; // make this context available globally for index.html
    }

    /**
     * Get formular to set body containing controls.
     */
    public getForm() {
        return this.form;
    }

    /**
     * Animation loop which renders visuals.
     */
    public animate(): void {
        this.stats.begin();

        const object = this.getVisual(); // retrieve current visual

        object.animate(); // call objects animate function
        this.renderer.render(object.getScene(), object.getCamera()); // set render based on its camera nd scene

        this.stats.end();

        requestAnimationFrame(() => this.animate());
    }

    /**
     * Get visual using deque data structure.
     */
    public getVisual(): Visual {
        return this.visuals[0];
    }

    /**
     * Sets new state and calls previous' exit and next's entry methods
     * @param state New State to set.
     */
    public setState(state: State<Media>) {
        this.state.exit();
        this.state = state;
        this.state.entry();
    }

    /**
     * Gets current state, mainly for media retrieval.
     */
    public getState(): State<Media> {
        return this.state;
    }

    /**
     * Gets single unique virtual audio listener for audio playing.
     */
    public getListener(): THREE.AudioListener {
        return this.listener;
    }

    /**
     * Sets currently displayed visual circularly to next one using deque logic.
     */
    public nextVisual(): void {
        this.visuals.push(<Visual>this.visuals.shift());
        this.state.getMedia().updateSubtitle();
    }

    /**
     * Sets currently displayed visual circularly to previous one using deque logic.
     */
    public prevVisual(): void {
        this.visuals.unshift(<Visual>this.visuals.pop());
        this.state.getMedia().updateSubtitle();
    }

    /**
     * Toggles loading screen for audio loading.
     */
    public toggleLoading(): void {
        const load = document.getElementById("loading-screen")!;
        load.classList.toggle("hidden");
        load.classList.toggle("fixed");
    }

    /**
     * Displays error screen with error message.
     * @param error Error to display.
     */
    public showError(error: unknown | any): void {
        // check if errors is not instance of Error class and display in console
        if (!(error instanceof Error)) {
            console.log(error);
            return;
        }

        // display error message and log it
        this.error.classList.remove("hidden");
        this.error.classList.add("flex");
        this.error.title = this.error.children[1].innerHTML = error.message;
        console.log(error);

        // set timeout to automatically remove error message
        setTimeout(() => {
            this.error.classList.remove("flex");
            this.error.classList.add("hidden");
            this.error.title = this.error.children[1].innerHTML = "";
        }, 4000);
    }
}

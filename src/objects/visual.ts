// Matej Dedina - visual.ts - Abstract visual class displaying audio visualisers.

import * as THREE from 'three';
import { core_scene } from "@/core/scene";
import { core_camera } from "@/core/camera";
import { systems_clock } from "@/systems/clock";
import { Context } from "@/utils/context";

export abstract class Visual {
    // Global context used to access audio analyser from state's media.
    private readonly context: Context;
    // Visualizer clock to access elapsed time and delta time for smoother animations
    private clock: THREE.Clock;
    // Main visual's scene where all of its objects are located and displayed
    private readonly scene: THREE.Scene;
    // Visualiser's perspective camera used to capture object in 3D scene
    private readonly camera: THREE.PerspectiveCamera;

    /**
     * @brief Set context and initializes systems and core components for visuals.
     * @param context Global context for data access and manipulation.
     * @protected
     */
    protected constructor(context: Context) {
        this.context = context;

        this.clock = systems_clock();
        this.scene = core_scene();
        this.camera = core_camera();
    }

    /**
     * Retrieves the audio analyser of current state media.
     */
    public getAnalyser(): THREE.AudioAnalyser {
        return this.context
            .getState()
            .getMedia()
            .getAnalyser();
    }

    /**
     * Retrieves scene containing visuals.
     */
    public getScene(): THREE.Scene {
        return this.scene;
    }

    /**
     * Retrieves camera capturing visuals.
     */
    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    /**
     * Retrieves delta time from clock for better animation.
     * @protected
     */
    protected getDelta(): number {
        return this.clock.getDelta();
    }

    /**
     * Retrieves elapsed time from clock for better animation.
     * @protected
     */
    protected getElapsedTime(): number {
        return this.clock.getElapsedTime();
    }

    /**
     * Abstract method which animates current visual.
     */
    public abstract animate(): void;

    /**
     * Abstract method which returns string name of visual for subtitle update.
     */
    public abstract toString(): string;
}
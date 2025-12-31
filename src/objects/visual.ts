import * as THREE from 'three';
import { core_scene } from "@/core/scene";
import { core_camera } from "@/core/camera";
import { systems_clock } from "@/systems/clock";
import { Context } from "@/utils/context";

export abstract class Visual {
    private readonly context: Context;
    private clock: THREE.Clock;

    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;

    protected constructor(context: Context) {
        this.clock = systems_clock();
        this.context = context;

        this.scene = core_scene();
        this.camera = core_camera();
    }

    public getAnalyser(): THREE.AudioAnalyser {
        return this.context
            .getState()
            .getMedia()
            .getAnalyser();
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera() {
        return this.camera;
    }

    protected getDelta(): number {
        return this.clock.getDelta();
    }

    protected getElapsedTime(): number {
        return this.clock.getElapsedTime();
    }

    public abstract animate(): void;
    public abstract toString(): string;
}
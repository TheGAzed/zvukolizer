import * as THREE from 'three';
import { core_scene } from "@/core/scene";
import { core_camera } from "@/core/camera";
import { systems_clock } from "@/systems/clock";
import { Context } from "@/utils/state";

export abstract class Visual {
    private context: Context;
    protected clock: THREE.Clock;

    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;

    protected constructor(renderer: THREE.WebGLRenderer, context: Context) {
        this.clock = systems_clock();
        this.context = context;

        this.scene = core_scene();
        this.camera = core_camera(renderer);
    }

    public getAnalyser(): THREE.AudioAnalyser {
        return this.context.getState().media.getAnalyser();
    }

    public abstract animate(): void;
    public abstract toString(): string;
}
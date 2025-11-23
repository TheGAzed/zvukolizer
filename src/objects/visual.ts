import * as THREE from 'three';
import { core_scene } from "@/core/scene";
import { core_camera } from "@/core/camera";
import { systems_clock } from "@/systems/clock";
import { Media } from "@/utils/device/media";

export abstract class Visual {
    private device: Media;
    protected clock: THREE.Clock;

    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;

    protected constructor(renderer: THREE.WebGLRenderer, device: Media) {
        this.clock = systems_clock();
        this.device = device;

        this.scene = core_scene();
        this.camera = core_camera(renderer);
    }

    public getAnalyser(): THREE.AudioAnalyser {
        return this.device.getAnalyser();
    }

    public abstract animate(): void;
    public abstract toString(): string;
}
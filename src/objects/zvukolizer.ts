import * as THREE from 'three';
import { core_scene } from "@/core/scene";
import { core_camera } from "@/core/camera";
import { systems_analyzer } from "@/systems/audio/analyzer";
import { systems_sound } from "@/systems/audio/sound";
import { systems_listener } from "@/systems/audio/listener";
import { systems_clock } from "@/systems/clock";
import { systems_loader } from "@/systems/audio/loader";

export abstract class Zvukolizer {
    protected sound: THREE.Audio;
    protected analyser: THREE.AudioAnalyser;
    protected listener: THREE.AudioListener;
    protected loader: THREE.AudioLoader;

    protected clock: THREE.Clock;

    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;

    protected constructor(renderer: THREE.WebGLRenderer, path: string) {
        this.listener = systems_listener();
        this.clock = systems_clock();

        this.sound = systems_sound(this.listener);
        this.loader = systems_loader(this.sound, path);
        this.analyser = systems_analyzer(this.sound);

        this.scene = core_scene();
        this.camera = core_camera(renderer);
    }

    public abstract animate(): void;
    public abstract toString(): string;
}
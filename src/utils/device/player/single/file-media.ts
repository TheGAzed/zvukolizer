import { SinglePlayer } from "@/utils/device/player/single/single-media";
import { Context } from "@/utils/context";
import * as THREE from "three";
import { systems_loader } from "@/systems/audio/loader";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class FileMedia extends SinglePlayer {
    private readonly context: Context;
    private readonly filename: string;

    constructor(context: Context, file: File) {
        super(context, URL.createObjectURL(file));

        this.context = context;
        this.filename = file.name;
    }

    protected initAnalyser(): THREE.AudioAnalyser {
        const loader = systems_loader();
        const filepath = this.getFilepath();

        loader.load(filepath, (buffer) => {
            this.getSound().setBuffer(buffer);
            this.getSound().loop = true;

            const button: HTMLButtonElement = document.getElementById("play-button")! as HTMLButtonElement;
            this.toggle(button);

            this.sliderControls();
            this.updateHeading();
            this.toggleLoadingScreen();
        })

        return systems_analyzer(this.getSound());
    }

    public updateHeading(): void {
        (document.getElementById("subtitle")! as HTMLHeadingElement).textContent = "[" + this.context.getVisual().toString().toUpperCase() + "] " + this.filename;
    }
}

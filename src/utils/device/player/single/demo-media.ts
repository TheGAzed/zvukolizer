import { Context } from "@/utils/context";

import { SinglePlayer } from "@/utils/device/player/single/single-media";
import * as THREE from "three";
import { systems_loader } from "@/systems/audio/loader";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class DemoMedia extends SinglePlayer {
    private readonly context: Context;
    constructor(context: Context) {
        super(context, "/sound/disorder.mp3");
        this.context = context;
    }

    protected initAnalyser(): THREE.AudioAnalyser {
        const loader = systems_loader();
        const filepath = this.getFilepath();

        loader.load(filepath, (buffer) => {
            this.getSound().setBuffer(buffer);
            this.getSound().loop = true;
            this.sliderControls();
            this.toggleLoadingScreen();
            this.updateHeading();
        })

        return systems_analyzer(this.getSound());
    }

    public updateHeading(): void {
        const h2 = document.getElementById("subtitle")! as HTMLHeadingElement;
        h2.textContent = "[" + this.context.getVisual().toString().toUpperCase() + "] Joy Division - Disorder";
    }
}

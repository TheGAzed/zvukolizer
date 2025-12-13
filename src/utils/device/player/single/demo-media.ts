import { Context } from "@/utils/context";

import { SinglePlayer } from "@/utils/device/player/single/single-media";
import * as THREE from "three";
import { systems_loader } from "@/systems/audio/loader";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class DemoMedia extends SinglePlayer {
    constructor(context: Context) {
        super(context, "/sound/disorder.mp3");
    }

    protected initAnalyser(): THREE.AudioAnalyser {
        const loader = systems_loader();
        const filepath = this.getFilepath();

        loader.load(filepath, (buffer) => {
            this.getSound().setBuffer(buffer);
            this.getSound().loop = true;
            this.sliderControls();
            this.toggleLoadingScreen();
        })

        return systems_analyzer(this.getSound());
    }
}

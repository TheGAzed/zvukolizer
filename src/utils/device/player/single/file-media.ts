import { SinglePlayer } from "@/utils/device/player/single/single-media";
import { Context } from "@/utils/context";
import * as THREE from "three";
import { systems_loader } from "@/systems/audio/loader";
import { systems_analyzer } from "@/systems/audio/analyzer";

export class FileMedia extends SinglePlayer {
    constructor(context: Context, filepath: string) {
        super(context, filepath);
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
            this.toggleLoadingScreen();
        })

        return systems_analyzer(this.getSound());
    }
}

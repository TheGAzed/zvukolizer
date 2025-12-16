import * as THREE from "three";

import { SinglePlayer } from "@/utils/device/player/single/single-media";
import { Context } from "@/utils/context";

export class FileMedia extends SinglePlayer {
    constructor(context: Context, sound: THREE.Audio) {
        super(context, sound);
        this.toggle();
    }

    public updateHeading(): void {
        document.getElementById("subtitle")!.textContent =
            "[" +
            this.getContext().getVisual().toString().toUpperCase() +
            "] " +
            this.getSound().name;
    }
}

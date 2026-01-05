// Matej Dedina - single-media.ts - Playable file audio input media representation.

import * as THREE from "three";

import { SingleMedia } from "@/utils/device/player/single/single-media";
import { Context } from "@/utils/context";

export class FileMedia extends SingleMedia {
    constructor(context: Context, sound: THREE.Audio) {
        super(context, sound);
        this.play();
    }
}

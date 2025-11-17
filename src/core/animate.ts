import * as THREE from "three";
import { Zvukolizer } from "@/objects/zvukolizer";

export function core_animate(renderer: THREE.WebGLRenderer, object: Zvukolizer) {
    requestAnimationFrame(() => core_animate(renderer, object));

    object.animate();

    renderer.render(object.scene, object.camera);
}

import * as THREE from "three";
import { Visual } from "@/objects/visual";

export function core_animate(renderer: THREE.WebGLRenderer, object: Visual) {
    requestAnimationFrame(() => core_animate(renderer, object));

    object.animate();

    renderer.render(object.scene, object.camera);
}

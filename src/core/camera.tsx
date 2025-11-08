import * as THREE from "three";

/**
 * Initializes and returns the project's core camera.
 * @param width Width of screen-space.
 * @param height Height of screen-space.
 */
export function core_camera(width: number, height: number) {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5; // set coordinate away from scene

    window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    return camera;
}
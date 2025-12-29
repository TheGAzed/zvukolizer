import * as THREE from "three";

export function core_camera(renderer: THREE.WebGLRenderer) {
    const w = renderer.domElement.width;
    const h = renderer.domElement.height;

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5; // set coordinate away from scene

    window.addEventListener("resize", () => {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    return camera;
}
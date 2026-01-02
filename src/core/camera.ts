import * as THREE from "three";

export function core_camera(): THREE.PerspectiveCamera {
    const main = document.getElementById("main")!;
    const w = main.clientWidth;
    const h = main.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5; // set coordinate away from scene

    window.addEventListener("resize", () => {
        const container = document.getElementById("main")!;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });

    return camera;
}
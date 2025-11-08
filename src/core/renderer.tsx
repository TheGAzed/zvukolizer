import * as THREE from "three";

export function core_renderer(width, height) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    return renderer;
}

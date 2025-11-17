import * as THREE from "three";

export function core_renderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const container = document.getElementById("main");

    let width = container ? container.clientWidth : window.innerWidth;
    let height = container ? container.clientHeight : window.innerHeight;

    renderer.setSize(width, height);

    renderer.setClearColor(0x030712, 1);

    container?.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
        if (!container) { return; }

        width = container ? container.clientWidth : window.innerWidth;
        height = container ? container.clientHeight : window.innerHeight;

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    return renderer;
}

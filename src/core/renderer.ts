import * as THREE from "three";

export function core_renderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const main = document.getElementById("main")!;

    renderer.setSize(main.clientWidth, main.clientHeight);
    renderer.setClearColor(0x030712, 1);
    main.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener("resize", () => {
        const container = document.getElementById("main")!;

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    return renderer;
}

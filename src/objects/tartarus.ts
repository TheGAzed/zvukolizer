import * as THREE from "three";

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

export class Tartarus extends Visual {
    constructor(context: Context) {
        super(context);

        const translate = [
            [-0.505, -0.505, -0.505],
            [-0.505, -0.505,  0.505],
            [-0.505,  0.505, -0.505],
            [-0.505,  0.505,  0.505],
            [ 0.505, -0.505, -0.505],
            [ 0.505, -0.505,  0.505],
            [ 0.505,  0.505, -0.505],
            [ 0.505,  0.505,  0.505],
        ];

        for (const t of translate) {
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            cubeGeometry.translate(t[0], t[1], t[2]);

            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x030712, transparent: false, opacity: 1, });
            const lineMaterial = new THREE.LineBasicMaterial();

            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            const line = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeometry), lineMaterial);

            const object = new THREE.Group().add(line, cube);
            this.getScene().add(object);
        }

        this.getScene().children.forEach((child: any) => {
            child.userData.targetScale = new THREE.Vector3(1, 1, 1);
        });
    }

    public animate(): void {
        const delta = this.clock.getDelta();
        const frequencies = this.getAnalyser().getFrequencyData();

        const children = this.getScene().children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            const freqX = 1 + ((frequencies[(3 * i)    ] / 255.0) * 1.5) * (Math.random() * 0.5);
            const freqY = 1 + ((frequencies[(3 * i) + 1] / 255.0) * 1.5) * (Math.random() * 0.5);
            const freqZ = 1 + ((frequencies[(3 * i) + 2] / 255.0) * 1.5) * (Math.random() * 0.5);

            const speed = 0.1;
            child.scale.lerp(child.userData.targetScale, speed);

            if (child.scale.distanceTo(child.userData.targetScale) < 0.01) {
                child.userData.targetScale.set(freqX, freqY, freqZ);
            }
        }

        this.getScene().rotation.x += delta * (0.1 + (frequencies[0] / 1023.0));
        this.getScene().rotation.y += delta * (0.1 + (frequencies[1] / 1023.0));
    }

    public toString(): string {
        return "Tartarus";
    }
}

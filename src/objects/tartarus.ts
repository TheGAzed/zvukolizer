// Matej Dedina - tartarus.ts - Morphing 2x2x2 cube made up of smaller scaling cubes

import * as THREE from "three";

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

export class Tartarus extends Visual {
    constructor(context: Context) {
        super(context);

        // translations for each of the 8 cubes' geometry to make bigger 2x2x2 cube (with offsets for nicer edge lines)
        // change origin for scaling of cubes
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

        // create 8 cube objects
        for (const t of translate) {
            // create geometries and translate them into single big cube
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            cubeGeometry.translate(t[0], t[1], t[2]);

            // create cube material
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x030712, transparent: false, opacity: 1, });

            // set cube and edge line materials into mesh
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            const line = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeometry), new THREE.LineBasicMaterial());

            // make cube and edges into single cube-line group to add into scene
            const object = new THREE.Group().add(line, cube);
            this.getScene().add(object);
        }

        // set user data target scale for smoother transitions
        this.getScene().children.forEach((child: any) => {
            child.userData.targetScale = new THREE.Vector3(1, 1, 1);
        });
    }

    public animate(): void {
        // retrieve delta time and audio analyser frequencies for smoother animation and sound morphing
        const delta = this.getDelta();
        const frequencies = this.getAnalyser().getFrequencyData();

        // get 8 cube-line objects to iterate and morph based on random noise and frequency data
        const children = this.getScene().children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            const freqX = 1 + ((frequencies[(3 * i)    ] / 255.0) * 1.5) * (Math.random() * 0.5);
            const freqY = 1 + ((frequencies[(3 * i) + 1] / 255.0) * 1.5) * (Math.random() * 0.5);
            const freqZ = 1 + ((frequencies[(3 * i) + 2] / 255.0) * 1.5) * (Math.random() * 0.5);

            // speed of morphing change
            const speed = 0.1;
            child.scale.lerp(child.userData.targetScale, speed); // linearly interpolate scaling (morphing)

            // condition to let interpolation reach its morphing state and then set a new one
            if (child.scale.distanceTo(child.userData.targetScale) < 0.01) {
                child.userData.targetScale.set(freqX, freqY, freqZ);
            }
        }

        // add cube rotation using frequency for more lively rotation
        this.getScene().rotation.x += delta * (0.1 + (frequencies[0] / 1023.0));
        this.getScene().rotation.y += delta * (0.1 + (frequencies[1] / 1023.0));
    }

    public toString(): string {
        return "Tartarus";
    }
}

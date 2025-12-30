import * as THREE from "three";

import vertexShader from "@/shaders/gaia.vert?raw"
import fragmentShader from "@/shaders/gaia.frag?raw"

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

export class Gaia extends Visual {
    private icosahedronMeshes: THREE.Mesh[];
    private readonly lineMesh: THREE.Line;

    constructor(context: Context) {
        super(context);

        this.icosahedronMeshes = [
            this.icosahedron(2, 1, 0.33),
            this.icosahedron(1.25, 5, 0.66),
            this.icosahedron(0.5, 25, 1),
        ];

        this.lineMesh = this.line();

        this.getCamera().rotateZ(Math.PI * (23.5 / 180));
        this.icosahedronMeshes.forEach(mesh => { this.getScene().add(mesh); });
        this.getScene().add(this.lineMesh);
    }

    toString(): string {
        return "gaia";
    }

    animate(): void {
        const ranges = [
            this.getRangeValue(20, 250),     // Bass
            this.getRangeValue(250, 2000),   // Mid
            this.getRangeValue(2000, 20000), // Treble
        ];

        for (let i = 0; i < this.icosahedronMeshes.length; i++) {
            const material = this.icosahedronMeshes[i].material as THREE.ShaderMaterial;

            material.uniforms.u_frequency.value = ranges[i % ranges.length];
            material.uniforms.u_time.value = this.getElapsedTime();
        }

        this.getScene().rotation.y += (Math.PI * (0.0002));
    }

    private getBinHz(index: number, sampleRate: number, fftSize: number): number {
        return (sampleRate / 2) * (index / (fftSize / 2));
    }

    private getRangeValue(minHz: number, maxHz: number): number {
        const data = this.getAnalyser().getFrequencyData();
        const sampleRate = this.getAnalyser().analyser.context.sampleRate;
        const fftSize = this.getAnalyser().analyser.fftSize;

        let sum = 0;
        let count = 0;

        for (let i = 0; i < data.length; i++) {
            const hz = this.getBinHz(i, sampleRate, fftSize);
            if (hz >= minHz && hz <= maxHz) {
                sum += data[i];
                count++;
            }
        }

        return count > 0 ? sum / count : 0;
    }

    private icosahedron(radius: number, detail: number, amplify: number): THREE.Mesh {
        const mat = new THREE.ShaderMaterial({
            wireframe: true,
            uniforms: { u_time: { value: 0.0 }, u_frequency: { value: 0.0 }, u_amplify: { value: amplify } },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        const geo = new THREE.IcosahedronGeometry(radius, detail);

        return new THREE.Mesh(geo, mat);
    }

    private line(): THREE.Line {
        const points = [
            new THREE.Vector3( 0, -2.5, 0 ),
            new THREE.Vector3( 0,  2.5, 0 ),
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        return new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xFFFFFF } ) );
    }
}

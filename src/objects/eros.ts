import * as THREE from "three";

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

import vertexShader from "@/shaders/eros.vert?raw"
import fragmentShader from "@/shaders/eros.frag?raw"

export class Eros extends Visual {
    private readonly meshes: THREE.Group = new THREE.Group();

    constructor(context: Context) {
        super(context);

        const count = 16;
        for (let i = 1; i <= count; i++) {
            this.meshes.add(this.ring(((i * (1 / count)) * 1.5) + 1));
        }

        const circle = new THREE.Mesh(
            new THREE.CircleGeometry(0.25),
            new THREE.ShaderMaterial({
                uniforms: { u_time: { value: 0.0 }, u_frequency: { value: 0.0 } },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            }),
        );

        this.getScene().add(this.meshes, circle);
        //this.getScene().rotateY(Math.PI / 2);
    }

    public animate(): void {
        const data = this.getAnalyser().getFrequencyData();
        const time = this.getElapsedTime();
        const frequency = data.reduce((total, x) => total + x, 0) / data.length;

        this.meshes.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.ShaderMaterial;

            material.uniforms.u_time.value = time;
            material.uniforms.u_frequency.value = frequency;
        });

        this.getScene().rotation.z += (Math.PI * (0.001));
    }

    private ring(radius: number) {
        return  new THREE.Mesh(
            new THREE.RingGeometry(radius, radius, 256),
            new THREE.ShaderMaterial({
                wireframe: true,
                uniforms: { u_time: { value: 0.0 }, u_frequency: { value: 0.0 } },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            }),
        );
    }

    public toString(): string {
        return "Eros";
    }
}

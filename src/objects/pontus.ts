import * as THREE from "three";

import vertexShader from "@/shaders/pontus.vert?raw"
import fragmentShader from "@/shaders/pontus.frag?raw"

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

export class Pontus extends Visual {
    private readonly lineMeshes: THREE.Group = new THREE.Group();
    private readonly planeMeshes: THREE.Group = new THREE.Group();
    private readonly lineCount: number = 32;
    private readonly planeHeight: number = 1;

    private readonly lineGeometry: THREE.BoxGeometry;
    private readonly planeGeometry: THREE.PlaneGeometry;

    constructor(context: Context) {
        super(context);

        this.lineGeometry = new THREE.BoxGeometry(5, 0.015, 0.015, 64);
        this.planeGeometry = new THREE.PlaneGeometry(5, this.planeHeight, 64);

        const height = 6;
        const posZ = 0.015;
        for (let i = 0; i < this.lineCount; i++) {
            const offset = i * (Math.random() * this.lineCount);

            const line = this.line(offset);
            const plane = this.plane(offset);

            line.scale.setX(1 + (i * 0.003));
            plane.scale.setX(1 + (i * 0.003));

            line.position.y = (i * (height / this.lineCount)) - (height / 2);
            plane.position.y = (i * (height / this.lineCount)) - ((height / 2) + (this.planeHeight / 2));

            line.position.z = plane.position.z = -(i * posZ);

            this.lineMeshes.add(line);
            this.planeMeshes.add(plane);
        }

        this.getScene().add(this.lineMeshes);
        this.getScene().add(this.planeMeshes);
    }

    public animate(): void {
        const data = this.getAnalyser().getFrequencyData();
        const time = this.getElapsedTime();

        for (let i = 0; i < this.lineCount; i++) {
            const reverse = (this.lineCount - 1) - i;
            const line = this.lineMeshes.children[reverse] as THREE.Mesh;
            const plane = this.planeMeshes.children[reverse] as THREE.Mesh;

            const frequency = data[i % data.length] / 256;

            const lineMaterial = line.material as THREE.ShaderMaterial;
            lineMaterial.uniforms.u_frequency.value = frequency;
            lineMaterial.uniforms.u_time.value = time;

            const planeMaterial = plane.material as THREE.ShaderMaterial;
            planeMaterial.uniforms.u_frequency.value = frequency;
            planeMaterial.uniforms.u_time.value = time;
        }
    }

    private line(offset: number): THREE.Mesh {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_offset: { value: offset },
                u_color: { value: new THREE.Color(0xFFFFFF) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        return new THREE.Mesh(this.lineGeometry, material);
    }

    private plane(offset: number): THREE.Mesh {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_offset: { value: offset },
                u_color: { value: new THREE.Color(0x030712).convertLinearToSRGB() }
            },

            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        return new THREE.Mesh(this.planeGeometry, material);
    }

    public toString(): string {
        return "Pontus";
    }
}


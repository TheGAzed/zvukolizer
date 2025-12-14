import * as THREE from "three";

import vertexShader from "@/shaders/tartarus.vert?raw"
import fragmentShader from "@/shaders/tartarus.frag?raw"

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

export class Tartarus extends Visual {
    private readonly lineMeshes: THREE.Group = new THREE.Group();
    private readonly planeMeshes: THREE.Group = new THREE.Group();
    private readonly lineCount: number = 48;
    private readonly planeHeight: number = 3;

    private readonly lineGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(10, 0.01, 0.001, 128);
    private readonly planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(10, this.planeHeight, 128, 1);

    constructor(context: Context) {
        super(context);

        const amplify = 1.5;
        const height = 12.0;
        const posZ = 0.001;
        for (let i = 0; i < this.lineCount; i++) {
            const offset = i * 79;

            const line: THREE.Mesh = this.line(amplify, offset);
            line.position.y = (i * (height / this.lineCount)) - (height / 2);
            line.position.z = -(i * posZ);
            this.lineMeshes.add(line);

            const plane = this.plane(amplify, offset);
            plane.position.y = (i * (height / this.lineCount)) - ((height / 2) + (this.planeHeight / 2));
            plane.position.z = -(i * posZ);
            this.planeMeshes.add(plane);
        }

        this.getScene().add(this.lineMeshes);
        this.getScene().add(this.planeMeshes);
    }

    public animate(): void {
        for (let i = 0; i < this.lineCount; i++) {
            const reverse = (this.lineCount - 1) - i;
            const line = this.lineMeshes.children[reverse] as THREE.Mesh;
            const plane = this.planeMeshes.children[reverse] as THREE.Mesh;

            const data = this.getAnalyser().getFrequencyData();
            const frequencies: number[] = [
                data[(((2 * i)) % data.length)] / 255,
                data[(((2 * i) + 1) % data.length)] / 255,
            ];

            const frequency = frequencies.reduce((s, a) => s + a, 0) / frequencies.length;
            const time = this.clock.getElapsedTime();

            (line.material as THREE.ShaderMaterial).uniforms.u_frequency.value = frequency;
            (line.material as THREE.ShaderMaterial).uniforms.u_time.value = time;

            (plane.material as THREE.ShaderMaterial).uniforms.u_frequency.value = frequency;
            (plane.material as THREE.ShaderMaterial).uniforms.u_time.value = time;
        }
    }

    private line(amplify: number, offset: number): THREE.Mesh {
        const mat = new THREE.ShaderMaterial({
            wireframe: true,
            uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_amplify: { value: amplify },
                u_offset: { value: offset },
                u_color: { value: new THREE.Color(0xFFFFFF) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        const geo = this.lineGeometry;

        return new THREE.Mesh(geo, mat);
    }

    private plane(amplify: number, offset: number): THREE.Mesh {
        const mat = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_amplify: { value: amplify },
                u_offset: { value: offset },
                u_color: { value: new THREE.Color(0x030712).convertLinearToSRGB() }
            },

            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        const geo = this.planeGeometry;

        return new THREE.Mesh(geo, mat);
    }

    public toString(): string {
        return "Tartarus";
    }
}
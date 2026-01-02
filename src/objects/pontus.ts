// Matej Dedina - pontus.ts - Lines based on Joy Divison album cover

import * as THREE from "three";

import vertexShader from "@/shaders/pontus.vert?raw"
import fragmentShader from "@/shaders/pontus.frag?raw"

import { Visual } from "@/objects/visual";
import { Context } from "@/utils/context";

export class Pontus extends Visual {
    // number of displayed lines
    private readonly lineCount: number = 32;
    // line meshes to warp
    private readonly lineMeshes: THREE.Group = new THREE.Group();
    // plane meshes to warp and hide backwards lines behind
    private readonly planeMeshes: THREE.Group = new THREE.Group();
    // shared line geometry using boxes for line width controls
    private readonly lineGeometry: THREE.BoxGeometry;
    // shared plane geometry to hide lines behind
    private readonly planeGeometry: THREE.PlaneGeometry;

    constructor(context: Context) {
        super(context);

        // create respective geometries
        this.lineGeometry = new THREE.BoxGeometry(5, 0.015, 0.015, 64);
        this.planeGeometry = new THREE.PlaneGeometry(5, 1, 64);

        // set height and Z positions to stack lines like stairs for hiding
        const height = 6;
        const posZ = 0.015;
        for (let i = 0; i < this.lineCount; i++) {
            const offset = i * (Math.random() * this.lineCount);

            // create individual lines and planes with offsets
            const line = this.line(offset);
            const plane = this.plane(offset);

            // scale lines and planes to remove smaller top lines due to posZ movement
            line.scale.setX(1 + (i * 0.003));
            plane.scale.setX(1 + (i * 0.003));

            // move lines on top of each other
            line.position.y = (i * (height / this.lineCount)) - (height / 2);
            plane.position.y = (i * (height / this.lineCount)) - ((height / 2) + (1 / 2));

            // move lines behind each other
            line.position.z = plane.position.z = -(i * posZ);

            // add lines and planes to groups
            this.lineMeshes.add(line);
            this.planeMeshes.add(plane);
        }

        // add line and plane groups to scene
        this.getScene().add(this.lineMeshes);
        this.getScene().add(this.planeMeshes);
    }

    public animate(): void {
        // get frequencies and elapsed time for line manipulation
        const frequencies = this.getAnalyser().getFrequencyData();
        const time = this.getElapsedTime();

        // for each line and plane warp its vertices through vertex shader
        for (let i = 0; i < this.lineCount; i++) {
            // reverse warping to warp lines at the top with lower frequencies
            const reverse = (this.lineCount - 1) - i;

            // get current index line and plane
            const line = this.lineMeshes.children[reverse] as THREE.Mesh;
            const plane = this.planeMeshes.children[reverse] as THREE.Mesh;

            // retrieve frequency as a decimal number in range [0..1]
            const frequency = frequencies[i % frequencies.length] / 256.0;

            // get line material to warp using vertex shader uniforms
            const lineMaterial = line.material as THREE.ShaderMaterial;
            lineMaterial.uniforms.u_frequency.value = frequency;
            lineMaterial.uniforms.u_time.value = time;

            // get plane material to warp using vertex shader uniforms
            const planeMaterial = plane.material as THREE.ShaderMaterial;
            planeMaterial.uniforms.u_frequency.value = frequency;
            planeMaterial.uniforms.u_time.value = time;
        }
    }

    /**
     * Generate line mesh with line geometry and shader material
     * @param offset Offset line warping to prevent warping in unison.
     * @private
     */
    private line(offset: number): THREE.Mesh {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_offset: { value: offset },
                u_color: { value: new THREE.Color(0xFFFFFF) } // set line color to white
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        return new THREE.Mesh(this.lineGeometry, material);
    }

    /**
     * Generate plane mesh with line geometry and shader material
     * @param offset Offset line warping to prevent warping in unison.
     * @private
     */
    private plane(offset: number): THREE.Mesh {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_offset: { value: offset },
                // set plane color to appear invisible/ blend with background to not display lines behind each other
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


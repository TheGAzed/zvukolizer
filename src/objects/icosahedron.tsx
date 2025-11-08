import * as THREE from "three";

import vertexShader from "@/shaders/shader.vert?raw"
import fragmentShader from "@/shaders/shader.frag?raw"

export function icosahedron_object(u_time: { value: number }, u_frequency: { value: number }) {
    const mat = new THREE.ShaderMaterial({
        wireframe: true,
        uniforms: {u_time, u_frequency},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const geo = new THREE.IcosahedronGeometry(2, 12);

    return new THREE.Mesh(geo, mat);
}
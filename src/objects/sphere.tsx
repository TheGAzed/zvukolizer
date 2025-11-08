import * as THREE from 'three';

export function sphere_object() {
    const geometry = new THREE.IcosahedronGeometry(1.0, 1.0);
    const material = new THREE.MeshStandardMaterial({ color: 0x0066ff, flatShading: true, transparent: true, opacity: 1.0 });

    const wireframe_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true,});
    const wireframe = new THREE.Mesh(geometry, wireframe_material);

    wireframe.scale.setScalar(1.001);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.add(wireframe);

    return mesh;
}
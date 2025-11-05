export function core_animate(renderer, scene, camera) {
    requestAnimationFrame(() => core_animate(renderer, scene, camera));
    renderer.render(scene, camera);
}

export function core_animate(renderer, scene, camera, data) {
    requestAnimationFrame(() => core_animate.apply(null, arguments));

    const bass = getRangeValue(data.analyzer, 20, 250);     // bass
    const treble = getRangeValue(data.analyzer, 2000, 20000); // treble

    data.uniforms.u_frequency.value = treble;
    data.uniforms.u_time.value = data.clock.getElapsedTime();
    renderer.render(scene, camera);
}

function getBinHz(index, sampleRate, fftSize) {
    return (sampleRate / 2) * (index / (fftSize / 2));
}

function getRangeValue(analyzer, minHz, maxHz) {
    const data = analyzer.getFrequencyData();
    const sampleRate = analyzer.analyser.context.sampleRate;
    const fftSize = analyzer.analyser.fftSize;

    let sum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i++) {
        const hz = getBinHz(i, sampleRate, fftSize);
        if (hz >= minHz && hz <= maxHz) {
            sum += data[i];
            count++;
        }
    }

    return count > 0 ? sum / count : 0;
}


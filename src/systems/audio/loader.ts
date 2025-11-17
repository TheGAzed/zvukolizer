import * as THREE from 'three';

export function systems_loader(sound: THREE.Audio, path: string) {
    const loader = new THREE.AudioLoader();
    loader.load(path, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);

        const form = document.getElementById("main-form") as HTMLFormElement;
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            sound.isPlaying ? sound.pause() : sound.play();

            const submitter = (e as SubmitEvent).submitter as HTMLElement;

            const useEl = submitter.querySelector("use") as SVGUseElement | null;
            if (!useEl) return;

            const current = useEl.getAttribute("xlink:href");
            useEl.setAttribute("xlink:href", current === "/icons/play.svg" ? "/icons/pause.svg" : "/icons/play.svg");
        });

        document.getElementById("loading-screen")?.remove();
    });

    return loader;
}
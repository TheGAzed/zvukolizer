import { Media } from "@/utils/device/media";

export abstract class Player extends Media {
    private startTime = 0;
    private pauseTime = 0;

    protected toggle(button: HTMLButtonElement): void {
        const sound = this.getSound();

        sound.isPlaying ? this.pause() : this.play();

        const label = document.querySelector(`label[for="${button.id}"]`)!;
        const use = label.querySelector("use")!;

        const current = use.getAttribute("xlink:href");
        use.setAttribute("xlink:href", current === "/icons/play.svg" ? "/icons/pause.svg" : "/icons/play.svg");
    }

    private play(): void {
        const sound = this.getSound();

        this.startTime = sound.context.currentTime - this.pauseTime;
        sound.play();
    }

    private pause(): void {
        const sound = this.getSound();

        this.pauseTime = sound.context.currentTime - this.startTime;
        sound.pause();
    }

    protected getPlaybackTime(): number {
        const sound = this.getSound();
        const playbackTime = sound.isPlaying ? sound.context.currentTime - this.startTime : this.pauseTime;

        console.log(playbackTime);

        return playbackTime % sound.buffer!.duration;
    }

    protected sliderControls(): void {
        const sound = this.getSound();

        const slider = document.getElementById("playback")! as HTMLInputElement;
        const current = document.getElementById("current-time")!;
        const duration = document.getElementById("duration-time")!;

        const maximum = Math.ceil(sound.buffer!.duration);
        slider.max = maximum.toString();
        duration.textContent = this.timeFormat(maximum);

        const updateSlider = () => {
            if (sound.isPlaying) {
                const value = Math.round(this.getPlaybackTime());

                slider.value = value.toString();
                current.textContent = this.timeFormat(value);
            }
            requestAnimationFrame(updateSlider);
        }
        updateSlider();
    }

    private timeFormat(seconds: number): string {
        const formatted = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(new Date(seconds * 1000));

        return formatted.toString();
    }
}

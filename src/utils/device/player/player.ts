import { Media } from "@/utils/device/media";

export abstract class Player extends Media {
    private startTime = 0;
    private pauseTime = 0;
    private timeout?: NodeJS.Timeout = undefined;

    protected toggle(button: HTMLButtonElement): void {
        const sound = this.getSound();

        sound.isPlaying ? this.stop() : this.play();

        const label = document.querySelector(`label[for="${button.id}"]`)!;
        const use = label.querySelector("use")!;

        const current = use.getAttribute("xlink:href");
        use.setAttribute("xlink:href", current === "/icons/play.svg" ? "/icons/pause.svg" : "/icons/play.svg");
    }

    private play(delay?: number): void {
        const sound = this.getSound();

        sound.offset = this.pauseTime;
        this.startTime = sound.context.currentTime - this.pauseTime;
        sound.play(delay);
    }

    private stop(): void {
        const sound = this.getSound();

        this.pauseTime = sound.context.currentTime - this.startTime;
        sound.stop();
    }

    protected getPlaybackTime(): number {
        const sound = this.getSound();
        const playbackTime = sound.isPlaying ? sound.context.currentTime - this.startTime : this.pauseTime;

        return playbackTime % sound.buffer!.duration;
    }

    protected sliderControls(): void {
        const sound = this.getSound();

        const slider = document.getElementById("playback")! as HTMLInputElement;
        const duration = document.getElementById("duration-time")!;

        slider.addEventListener("input", () => {
            const wasPlaying = sound.isPlaying;
            sound.stop();

            const value = Number(slider.value);
            sound.offset = value;

            const current = document.getElementById("current-time")!;
            current.textContent = this.timeFormat(value);

            this.pauseTime = value;
            this.startTime = sound.context.currentTime - value;

            if (wasPlaying) {
                sound.play();
            }
        });

        const maximum = Math.ceil(sound.buffer!.duration);
        slider.max = maximum.toString();
        duration.textContent = this.timeFormat(maximum);

        this.timeout = setInterval(() => this.updateSlider(slider), 1000);
    }

    private updateSlider(slider: HTMLInputElement): void {
        const sound = this.getSound();
        const current = document.getElementById("current-time")!;

        if (sound.isPlaying) {
            const value = Math.round(this.getPlaybackTime());

            slider.value = value.toString();
            current.textContent = this.timeFormat(value);
        }
    }

    private timeFormat(seconds: number): string {
        const formatted = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(new Date(seconds * 1000));

        return formatted.toString();
    }

    public destructor(): void {
        const sound = this.getSound();
        sound.disconnect();

        const slider = document.getElementById("playback")! as HTMLInputElement;
        slider.removeEventListener("input", () => {});
        clearInterval(this.timeout);
    }
}

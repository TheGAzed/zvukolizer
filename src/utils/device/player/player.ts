import { Media } from "@/utils/device/media";

export abstract class Player extends Media {
    private startTime = 0;
    private pauseTime = 0;
    private timeout?: NodeJS.Timeout = undefined;
    private slider: HTMLInputElement = document.getElementById("playback")! as HTMLInputElement;

    protected toggle(): void {
        this.getSound().isPlaying ? this.stop() : this.play();
    }

    protected resetPlayback(): void {
        this.startTime = 0;
        this.pauseTime = 0;

        this.removeListener();
        this.updateRange();
        this.updateHeading();
        this.addListener();
    }

    protected play(delay?: number): void {
        const sound = this.getSound();

        sound.offset = this.pauseTime;
        this.startTime = sound.context.currentTime - this.pauseTime;
        sound.play(delay);

        const img = document.getElementById("play")!;
        img.setAttribute("src", "icons/pause.svg");
    }

    protected stop(): void {
        const sound = this.getSound();

        this.pauseTime = sound.context.currentTime - this.startTime;
        sound.stop();

        const img = document.getElementById("play")!;
        img.setAttribute("src", "icons/play.svg");
    }

    protected getPlaybackTime(): number {
        const sound = this.getSound();
        const playbackTime = sound.isPlaying ? sound.context.currentTime - this.startTime : this.pauseTime;

        return playbackTime % sound.buffer!.duration;
    }

    public initializer(): void {
        this.updateRange();
        this.addListener();
    }

    private listener(): void {
        const sound = this.getSound();
        const wasPlaying = sound.isPlaying;
        this.stop();

        const value = Number(this.slider.value);
        sound.offset = value;

        const current = document.getElementById("current-time")!;
        current.textContent = this.timeFormat(value);

        this.pauseTime = value;
        this.startTime = sound.context.currentTime - value;

        if (wasPlaying) {
            this.play();
        }
    }

    private addListener(): void {
        this.slider.addEventListener("input", () => this.listener());
        this.timeout = setInterval(() => this.updateSlider(), 1000);
    }

    private removeListener(): void {
        this.slider.removeEventListener("input", () => this.listener());
        clearInterval(this.timeout);
    }

    protected updateRange(): void {
        const sound = this.getSound();
        const duration = document.getElementById("duration-time")!;

        const maximum = Math.ceil(sound.buffer!.duration);
        this.slider.max = maximum.toString();
        duration.textContent = this.timeFormat(maximum);
    }

    private updateSlider(): void {
        const sound = this.getSound();
        const current = document.getElementById("current-time")!;

        if (sound.isPlaying) {
            const value = Math.round(this.getPlaybackTime());

            this.slider.value = value.toString();
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
        super.destructor();
        this.removeListener();
    }
}

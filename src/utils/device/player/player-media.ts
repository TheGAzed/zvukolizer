// Matej Dedina - player-media.ts - Abstract playable audio input media representation.

import { Media } from "@/utils/device/media";

export abstract class PlayerMedia extends Media {
    private startTime: number = 0;
    private pauseTime: number = 0;
    private timeout?: NodeJS.Timeout = undefined;
    private slider: HTMLInputElement = document.getElementById("playback")! as HTMLInputElement;

    public destructor(): void {
        super.destructor();
        this.removeListener();
    }

    public initializer(): void {
        this.updateRange();
        this.addListener();
    }

    protected toggle(): void {
        this.getSound().isPlaying ? this.stop() : this.play();
    }

    /**
     * Resets playback for multi-file (folder) media player.
     * @protected
     */
    protected resetPlayback(): void {
        this.startTime = 0;
        this.pauseTime = 0;

        this.removeListener();
        this.updateRange();
        this.updateSubtitle();
        this.addListener();
    }

    /**
     * Starts playing sound based on delay.
     * @param delay Delay sound (unused).
     * @protected
     */
    protected play(delay?: number): void {
        const sound = this.getSound();

        sound.offset = this.pauseTime;
        this.startTime = sound.context.currentTime - this.pauseTime;
        sound.play(delay);

        const img = document.getElementById("play")!;
        img.setAttribute("src", "icons/pause.svg");
    }

    /**
     * Stops playing sound.
     * @protected
     */
    protected stop(): void {
        const sound = this.getSound();

        this.pauseTime = sound.context.currentTime - this.startTime;
        sound.stop();

        const img = document.getElementById("play")!;
        img.setAttribute("src", "icons/play.svg");
    }

    /**
     * Gets time of playback for player slider position.
     * @protected
     */
    protected getPlaybackTime(): number {
        const sound = this.getSound();
        const playbackTime = sound.isPlaying ? sound.context.currentTime - this.startTime : this.pauseTime;

        return playbackTime % sound.buffer!.duration;
    }

    /**
     * Updates range to sound if first initialization or after sound change.
     * @protected
     */
    protected updateRange(): void {
        const sound = this.getSound();
        const duration = document.getElementById("duration-time")!;

        const maximum = Math.ceil(sound.buffer!.duration);
        this.slider.max = maximum.toString();
        duration.textContent = this.timeFormat(maximum);
    }

    protected getName(): string {
        return this.getSound().name;
    }

    /**
     * Slider listener for playback manipulation.
     * @private
     */
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

    /**
     * Adds listener method to slider.
     * @private
     */
    private addListener(): void {
        this.slider.addEventListener("input", () => this.listener());
        this.timeout = setInterval(() => this.updateSlider(), 1000);
    }

    /**
     * Removes listener method from slider.
     * @private
     */
    private removeListener(): void {
        this.slider.removeEventListener("input", () => this.listener());
        clearInterval(this.timeout);
    }

    /**
     * Updates slider current playback time and its thumb position.
     * @private
     */
    private updateSlider(): void {
        const sound = this.getSound();
        const current = document.getElementById("current-time")!;

        if (sound.isPlaying) {
            const value = Math.round(this.getPlaybackTime());

            this.slider.value = value.toString();
            current.textContent = this.timeFormat(value);
        }
    }

    /**
     * Turns generic integer-based time into formated time.
     * @param seconds Time in seconds to format.
     * @private
     */
    private timeFormat(seconds: number): string {
        const formatted = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(new Date(seconds * 1000));

        return formatted.toString();
    }
}

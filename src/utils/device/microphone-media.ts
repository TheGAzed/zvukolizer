import { Media } from "@/utils/device/media";

import microphone from "@/components/pages/mic.html?raw"

export class Microphone extends Media {
    public initializer(): void {
    }

    getHtmlControls(): string {
        return microphone;
    }

    handleControls(event: Event): void {
    }

    updateHeading(): void {
    }

    protected toggle(): void {
        throw new Error("Method not implemented.");
    }
}
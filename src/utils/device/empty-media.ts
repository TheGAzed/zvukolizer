import { Media } from "@/utils/device/media";
import { Context } from "@/utils/context";
import { systems_sound } from "@/systems/audio/sound";

export class EmptyMedia extends Media {
    constructor(context: Context) {
        super(context, systems_sound(context.getListener()));
    }

    getHtmlControls(): string {
        return "";
    }

    handleControls(event: Event): void {
    }

    initializer(): void {
    }

    updateSubtitle(): void {
    }

    protected toggle(): void {
    }

    protected getName(): string {
        return "";
    }
}
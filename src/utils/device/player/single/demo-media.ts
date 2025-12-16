import { SinglePlayer } from "@/utils/device/player/single/single-media";

export class DemoMedia extends SinglePlayer {
    public updateHeading(): void {
        const h2 = document.getElementById("subtitle")! as HTMLHeadingElement;
        h2.textContent = "[" + this.getContext().getVisual().toString().toUpperCase() + "] " + this.getSound().name;
    }
}

import { PlayerMedia } from "@/utils/device/player/player-media";
import singlePlayer from "@/components/pages/single.html?raw"

export abstract class SingleMedia extends PlayerMedia {
    public getHtmlControls(): string {
        return singlePlayer;
    }

    public handleControls(event: Event): void {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;

        if (submitter.name == "play") {
            this.toggle();
        }
    }
}

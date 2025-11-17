import { core_renderer } from "@/core/renderer";
import { core_animate } from "@/core/animate";

import { Gaia } from "@/objects/gaia";

const renderer = core_renderer();
const object = new Gaia(renderer, "sound/disorder.mp3");

core_animate(renderer, object);

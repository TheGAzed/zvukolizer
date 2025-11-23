import { core_renderer } from "@/core/renderer";
import { core_animate } from "@/core/animate";

import { Context } from "@/utils/state";
import { systems_listener } from "@/systems/audio/listener";

const renderer = core_renderer();
const context = new Context(renderer, systems_listener())
core_animate(renderer, context.getVisual());

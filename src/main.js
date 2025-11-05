import { core_renderer } from "./core/renderer";
import { core_scene } from "./core/scene";
import { core_camera } from "./core/camera";
import { core_animate } from "./core/animate";

import { sphere_object } from "./objects/sphere";
import { hemisphere_light_object } from "./objects/hemisphere_light";

const renderer = core_renderer(innerWidth, innerHeight);
const camera = core_camera(innerWidth, innerHeight);

const sphere = sphere_object();
const light = hemisphere_light_object();

const scene = core_scene();
scene.add(light, sphere);

core_animate(renderer, scene, camera);

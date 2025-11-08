import { core_renderer } from "@/core/renderer";
import { core_scene } from "@/core/scene";
import { core_camera } from "@/core/camera";
import { core_animate } from "@/core/animate";

import { hemisphere_light_object } from "./objects/hemisphere_light";

import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { icosahedron_object } from "./objects/icosahedron";
import { systems_listener } from "./systems/audio/listener";
import { systems_sound } from "./systems/audio/sound";
import { systems_analyzer } from "./systems/audio/analyzer";
import { systems_clock } from "./systems/clock";

const renderer = core_renderer(innerWidth, innerHeight);
const camera = core_camera(innerWidth, innerHeight);

const uniforms = { u_time: { value: 0.0 }, u_frequency: { value: 0.0 }, };
const scene = core_scene();

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const listener = systems_listener();
camera.add(listener);

const sound = systems_sound(listener);

scene.add(hemisphere_light_object(), icosahedron_object(uniforms));

const analyzer = systems_analyzer(sound);
const clock = systems_clock();

core_animate(renderer, scene, camera, { uniforms: uniforms , clock: clock, analyzer: analyzer });

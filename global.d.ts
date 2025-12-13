declare module "*.vert?raw" {
    const value: string;
    export default value;
}

declare module "*.frag?raw" {
    const value: string;
    export default value;
}

declare module "*.glsl?raw" {
    const value: string;
    export default value;
}

declare module '*.html?raw' {
    const content: string;
    export default content;
}

declare module "*.vert";
declare module "*.frag";
declare module "*.glsl";

export interface SampleImage {
  name: string
  label: string
  src: string
}

export const SAMPLE_IMAGES: SampleImage[] = [
  { name: "metal-surface.png", label: "Metal Surface", src: "/samples/metal-surface.png" },
  { name: "glass-bottle.png", label: "Glass Bottle", src: "/samples/glass-bottle.png" },
  { name: "metal-screw.png", label: "Metal Screw", src: "/samples/metal-screw.png" },
  { name: "woven-fabric.png", label: "Woven Fabric", src: "/samples/woven-fabric.png" },
]

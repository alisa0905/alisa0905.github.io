declare module "meshline" {
  import { BufferGeometry, Material, Texture, Vector2 } from "three";

  export class MeshLineGeometry extends BufferGeometry {
    setPoints(points: ArrayLike<number> | Array<{ x: number; y: number; z: number }>): void;
  }

  export class MeshLineMaterial extends Material {
    color: string | number;
    resolution: Vector2 | [number, number];
    useMap: boolean;
    map: Texture;
    repeat: Vector2 | [number, number];
    lineWidth: number;
    constructor(parameters?: {
      color?: string | number;
      depthTest?: boolean;
      resolution?: Vector2 | [number, number];
      useMap?: boolean;
      map?: Texture;
      repeat?: Vector2 | [number, number];
      lineWidth?: number;
    });
  }
}

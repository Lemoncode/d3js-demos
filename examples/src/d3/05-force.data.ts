import { SimulationNodeDatum } from "d3-force";

export interface RandomParticle extends SimulationNodeDatum {
  color: number;
  size: number;
}

const generateRandomParticles = (): RandomParticle => ({
  color: Math.random(),
  size: Math.random(),
  x: Math.random(),
  y: Math.random(),
});

export const randomParticles: RandomParticle[] = Array(45).fill(0).map(generateRandomParticles);
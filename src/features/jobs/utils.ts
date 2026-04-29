import type { Color, Material } from "./types"

const MATERIAL_BASE_PRICE: Record<Material, number> = {
  PLA: 5,
  PETG: 8,
  ABS: 10,
  Resin: 15,
}

const COLOR_SURCHARGE: Record<Color, number> = {
  White: 0,
  Black: 0,
  Gray: 0,
  Red: 2,
  Blue: 2,
  Green: 2,
  Yellow: 2,
}

export function calcPrice(
  material: Material,
  color: Color,
  fileSizeBytes: number
): number {
  const base = MATERIAL_BASE_PRICE[material]
  const colorExtra = COLOR_SURCHARGE[color]
  const sizeExtra = (fileSizeBytes / (1024 * 1024)) * 0.1
  return parseFloat((base + colorExtra + sizeExtra).toFixed(2))
}

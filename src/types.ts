/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point {
  x: number;
  y: number;
}

export enum ActivityType {
  LINEAR_COMBINATION = 'LINEAR_COMBINATION',
  SUBTRACTION = 'SUBTRACTION',
  EQUILIBRIUM = 'EQUILIBRIUM',
}

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string,
  isDashed = false
) => {
  const headlen = 12;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  if (isDashed) ctx.setLineDash([5, 5]);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.setLineDash([]); // Reset dash for head
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.fill();

  if (label) {
    ctx.font = "bold 14px 'Inter', system-ui, sans-serif";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 4;
    ctx.fillText(label, toX + 8, toY - 12);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
};

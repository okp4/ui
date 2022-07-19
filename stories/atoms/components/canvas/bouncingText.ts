/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
const S = {
  x: -1,
  y: -1,
  dx: 2
}

export const drawBouncingText = (canvas: HTMLCanvasElement, deltaCount: number): void => {
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const text = `Size: ${canvas.width} / ${canvas.height}`
    const metrics = ctx.measureText(text)

    if (S.x === -1) {
      S.x = (canvas.width - metrics.width) / 2
    }
    if (S.y === -1) {
      S.y = canvas.height / 2
    }

    ctx.fillStyle = '#0f224a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ced2d9'
    ctx.font = '25px sans-serif'
    ctx.fillText(text, S.x, S.y)
    ctx.fill()

    if (S.x + metrics.width > canvas.width) {
      S.x = canvas.width - metrics.width
      S.dx = -S.dx
    }

    if (S.x <= 0) {
      S.x = 1
      S.dx = -S.dx
    }

    S.x += S.dx
  }
}

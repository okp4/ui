/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
let x = -1
let y = -1
let dx = 2

export const drawBouncingText = (canvas: HTMLCanvasElement, deltaCount: number): void => {
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const text = `Size: ${canvas.width} / ${canvas.height}`
    const metrics = ctx.measureText(text)

    if (x == -1) {
      x = (canvas.width - metrics.width) / 2
    }
    if (y == -1) {
      y = canvas.height / 2
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0f224a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ced2d9'
    ctx.font = '25px sans-serif'
    ctx.fillText(text, x, y)
    ctx.fill()

    if (x + metrics.width > canvas.width) {
      x = canvas.width - metrics.width
      dx = -dx
    }

    if (x <= 0) {
      x = 1
      dx = -dx
    }
    
    x += dx
  }
}

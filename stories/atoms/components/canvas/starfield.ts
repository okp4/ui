/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
export type Star = {
  x: number
  y: number
  z: number
  px: number
  py: number
}

const speed = 0.09

const moveStar = (s: Star): Star => {
  s.px = s.x
  s.py = s.y
  s.z += speed
  s.x += s.x * (speed * 0.2) * s.z
  s.y += s.y * (speed * 0.2) * s.z

  return s
}

const inBound =
  (width: number, height: number): ((s: Star) => boolean) =>
  (s: Star): boolean =>
    !(
      s.x > width / 2 + 50 ||
      s.x < -width / 2 - 50 ||
      s.y > height / 2 + 50 ||
      s.y < -height / 2 - 50
    )

const drawStar =
  (canvas: HTMLCanvasElement): ((s: Star) => Star) =>
  (s: Star): Star => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = `rgb(176,224,230)`
      ctx.lineWidth = s.z / 2
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.px, s.py)
      ctx.stroke()
    }
    return s
  }

function* starsGen(nb: number, width: number, height: number): Generator<Star> {
  for (let i = 0; i < nb; i++) {
    const x = Math.random() * width - width / 2
    const y = Math.random() * height - height / 2
    const star: Star = {
      x: x,
      y: y,
      z: Math.random() * 2,
      px: x,
      py: y
    }
    yield star
  }
}

let cw = 0
let ch = 0
let stars: Star[] = []

export const draw =
  (nbStars: number): ((canvas: HTMLCanvasElement, deltaCount: number) => void) =>
  (canvas: HTMLCanvasElement): void => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.resetTransform()
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // debugger;

      if (stars.length === 0 || cw !== canvas.width || ch !== canvas.height) {
        stars = [...starsGen(nbStars, canvas.width, canvas.height)]
        cw = canvas.width
        ch = canvas.height
      }

      stars = Array.from(stars)
        .map(drawStar(canvas))
        .map(moveStar)
        .filter(inBound(canvas.width, canvas.height))

      stars = [...stars, ...starsGen(nbStars - stars.length, canvas.width, canvas.height)]
    }
  }

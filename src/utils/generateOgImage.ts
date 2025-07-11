import { createCanvas, loadImage } from 'canvas'
import { type CanvasRenderingContext2D } from 'canvas'
import fs from 'fs'

export async function generateOgImage(
    templatePath: string,
    outputPath: string,
    text: string,
    x: number,
    y: number,
    width: number,
    font: string = 'bold 50px Sans-serif',
    color: string = 'black',
) {
    const template = await loadImage(templatePath)
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(template, 0, 0)
    ctx.fillStyle = color
    ctx.font = font
    ctx.textBaseline = 'top'

    const lines = wrapText(ctx, text, width)

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * 60)
    }

    const buffer = canvas.toBuffer('image/jpeg')
    fs.writeFileSync(outputPath, buffer)

    return outputPath
}

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
        const testLine = currentLine + word + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width

        if (testWidth > maxWidth && currentLine.length > 0) {
            lines.push(currentLine.trim())
            currentLine = word + ' '
        } else {
            currentLine = testLine
        }
    }

    if (currentLine.length > 0) {
        lines.push(currentLine.trim())
    }

    return lines
}

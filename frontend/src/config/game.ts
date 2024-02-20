import { GameDataType } from "@/hooks/context/types"

function drawRect(
	x: number,
	y: number,
	w: number,
	h: number,
	color: string,
	ctx: CanvasRenderingContext2D,
	ispaddle: boolean,
	isDefault: boolean
) {
	ctx.beginPath()
	if (!ispaddle || isDefault) {
		ctx.fillStyle = color
		ctx.fillRect(x, y, w, h)
		ctx.shadowBlur = 0
		ctx.shadowColor = color
	} else {
		let radius = 25
		if (w < 2 * radius) radius = w / 2
		if (h < 2 * radius) radius = h / 2
		ctx.shadowBlur = radius * 1.5
		ctx.shadowColor = color
		ctx.moveTo(x + radius, y)
		ctx.arcTo(x + w, y, x + w, y + h, radius)
		ctx.arcTo(x + w, y + h, x, y + h, radius)
		ctx.arcTo(x, y + h, x, y, radius)
		ctx.arcTo(x, y, x + w, y, radius)
		ctx.fillStyle = color
		ctx.fill()
	}
	ctx.closePath()
}
function drawCircle(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D, isDefault: boolean) {
	ctx.beginPath()
	ctx.fillStyle = color
	if (!isDefault) ctx.arc(x, y, r , 0, Math.PI * 2, false)
	else ctx.fillRect(x - r, y - r, r * 2, r * 2)
	ctx.fill()
	ctx.closePath()
}

function drawNet(data, ctx: CanvasRenderingContext2D, lineColor: string) {
	for (let i = 0; i <= 800; i += 15) {
		drawRect(800 / 2 - 2.5, i, 5, 10, lineColor, ctx, false, false)
	}
}

export function render(data: GameDataType, canvas: any) {
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
	drawRect(0, 0, 800, 800, '#000', ctx, false, false)
	drawRect(
		0,
		data.player1.y,
		20,
		5,
		'#FF',
		ctx,
		true,
		false
	)
	drawRect(
		800 - 20,
		data.player2.y,
		20,
		5,
		'#00FF',
		ctx,
		true,
		true
	)
	drawNet(data, ctx, '#FFF')
	drawCircle(
		data.ball.x,
		data.ball.y,
		5,
		'#FFF',
		ctx,
		false
	)
}
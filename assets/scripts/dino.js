

class Entity {
	x = 0
	y = 0
	width
	height
	image
	sprite

	constructor(imageWidth, imageHeight, imagePath) {
		this.image = new Image(imageWidth, imageHeight)
		this.image.src = imagePath
		this.width = imageWidth
		this.height = imageHeight
		this.image.onload = () => {
			this.sprite = createImageBitmap(this.image)
		}
	}

	move(xOffset) {
		this.x += xOffset
	}

	draw(ctx, canHeight) {
		if (this.sprite) {
			this.sprite.then(bitmap => {
				ctx.drawImage(bitmap, this.x, canHeight -this.height - this.y)
			})
		}
		return
	}

	tick(ctx, height) {
		this.draw(ctx, height)
	}
}

class Dino extends Entity {
	maxJump = 120
	state = 'runing'

	constructor() {
		super(74, 96, './assets/images/mario.png')

	}

	jump() {
		if (this.state !== 'runing') return
		this.state = 'jumping'
		let interval = setInterval(() => {
			if (this.y === 0 && this.state === 'floating') {
				clearInterval(interval)
				this.state = 'runing'

			}
			if (this.y >= this.maxJump) {
				this.state = 'floating'
			}
			switch (this.state) {
				case 'jumping':
					this.y++
					break
				case 'floating':
					this.y--
					break
			}
			
		}, 3)
	}

	tick(ctx, height) {
		this.draw(ctx, height)

	}

}

class Cactus extends Entity {
	constructor(canWidth) {
		super(82, 80, './assets/images/Goomba.png')
		this.x = canWidth + 82
	}
    tick(ctx, canHeight) {
        this.draw(ctx, canHeight)
		this.move(-5)
	}
}

window.addEventListener('load', () => {
	let highscore = 0
	const startBtn = document.getElementById('start')
	const restartBtn = document.getElementById('restart')
	const scoreCounter = document.getElementById('score')
	const can = document.getElementById('dino')
	const ctx = can.getContext('2d')
	const width = can.offsetWidth
	const height = can.offsetHeight
	can.width = width
	can.height = height
	let dino, cactus

	function stop(){
		restartBtn.classList.remove('is-hidden')
		if(highscore < +scoreCounter.textContent){
			localStorage.setItem('highscore', +scoreCounter.textContent)
		}

	}

	function run() {
		dino = new Dino()
		cactus = new Cactus(width)
		scoreCounter.textContent = 0
		startBtn.classList.add('is-hidden')
		restartBtn.classList.add('is-hidden')
		globalTick()
	}
    function globalTick() {
		ctx.beginPath()
		ctx.fillStyle = 'white'
		ctx.fillRect(0, 0, width, height)
        cactus.tick(ctx, height)
        dino.tick(ctx, height)
		if((cactus.x+cactus.width/2 <=dino.x + dino.width && cactus.x+cactus.width/2 > dino.x) && dino.y <= cactus.height/2){
			stop()
			return
		}
        if(cactus.x < -cactus.width){
			cactus = new Cactus(width)
			scoreCounter.textContent = +scoreCounter.textContent+1
		}
		requestAnimationFrame(globalTick)
	}

	function handleKeyboard(event) {
		switch (event.code) {
			case 'Space':
			case 'ArrowUp':
				dino.jump()
		}
	}

	document.addEventListener('keydown', handleKeyboard)
	startBtn.addEventListener('click', run)
	restartBtn.addEventListener('click', run)
	if('highscore' in localStorage){
		highscore = localStorage.getItem('highscore')
		scoreCounter.textContent = highscore
	}
})
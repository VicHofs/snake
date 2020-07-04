import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { useInterval } from './useInterval.js';
import {
	mapSize,
	snakeSpawnPos,
	appleSpawnPos,
	mapScale,
	speed,
	compass,
} from './initializer.js';
import './App.css';

const App = () => {
	const canvasRef = useRef();
	const [modalOpen, setModalOpen] = useState(true);
	const [snake, setSnake] = useState(snakeSpawnPos);
	const [apple, setApple] = useState(appleSpawnPos);
	const [momentum, setMomentum] = useState([0, -1]);
	const [snakeSpeed, setSnakeSpeed] = useState(null);
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		const context = canvasRef.current.getContext('2d');
		context.setTransform(mapScale, 0, 0, mapScale, 0, 0);
	});

	const startGame = () => {
		setSnake(snakeSpawnPos);
		setApple(appleSpawnPos);
		setMomentum([0, -1]);
		setSnakeSpeed(speed);
		setGameOver(false);
	};

	const move = (keyCode) => {
		if (keyCode in compass) {
			const newMomentum = compass[keyCode];
			if (
				newMomentum.map(Math.abs)[0] !== momentum.map(Math.abs)[0] &&
				newMomentum.map(Math.abs)[1] !== momentum.map(Math.abs)[1]
			)
				setMomentum(newMomentum);
		}
		else if (keyCode === 13 || keyCode === 32) startGame();
	};

	const endGame = () => {
		setSnakeSpeed(null);
		setGameOver(true);
		alert('GAME OVER!');
	};

	const wrapAdjust = (value, index) => {
		if (value >= mapSize[index] / mapScale) return 0;
		else if (value < 0) return mapSize[index] / mapScale - 1;
		else return value;
	};

	const spawnApple = () =>
		apple.map((_, i) => Math.floor((Math.random() * mapSize[i]) / mapScale));

	const checkCollision = (head, snek = snake) => {
		for (const segment of snek) {
			if (head[0] === segment[0] && head[1] === segment[1]) return true;
		}
		return false;
	};

	const checkAppleCollision = (snek) => {
		if (snek[0][0] === apple[0] && snek[0][1] === apple[1]) {
			let newApple = spawnApple();
			while (checkCollision(newApple, snek)) spawnApple();
			setApple(newApple);
			return true;
		}
		return false;
	};

	const gameOn = () => {
		const snakeCopy = JSON.parse(JSON.stringify(snake));
		const newSnakeHead = [
			wrapAdjust(snakeCopy[0][0] + momentum[0], 0),
			wrapAdjust(snakeCopy[0][1] + momentum[1], 1),
		];
		snakeCopy.unshift(newSnakeHead);
		if (checkCollision(newSnakeHead)) endGame();
		if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
		setSnake(snakeCopy);
		console.log('head position is', newSnakeHead);
		console.log('momentum is', momentum);
	};

	useEffect(() => {
		const context = canvasRef.current.getContext('2d');
		context.clearRect(0, 0, mapSize[0], mapSize[1]);
		context.fillStyle = '#ff353a';
		context.fillRect(apple[0], apple[1], 1, 1);
		context.fillStyle = '#00ff40';
		snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
	}, [snake, apple, gameOver]);

	useInterval(() => gameOn(), snakeSpeed);

	const element = document.getElementById('root');

	function openFullscreen() {
		if (element.requestFullscreen) {
		  element.requestFullscreen();
		} else if (element.mozRequestFullScreen) { /* Firefox */
		  element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		  element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) { /* IE/Edge */
		  element.msRequestFullscreen();
		}
	  }

	return (
		<div
			className="keyCap"
			role="button"
			tabIndex="-1"
			onKeyDown={(event) => move(event.keyCode)}
		>
			<Modal className="modal" overlayClassName="modalOverlay" isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
				<h2 className="modalTitle">Would you like to enable fullscreen?</h2>
				<p className="modalBody">(Recommended)</p>
				<button className="modalButton"onClick={() => {setModalOpen(false); openFullscreen()}}>Ok</button>

			</Modal>
			<h1 className="mainTitle">Classic Snake</h1>
			<canvas
				className="map"
				ref={canvasRef}
				width={`${mapSize[0]}px`}
				height={`${mapSize[1]}px`}
			/>
			{/* {gameOver && <div>GAME OVER!</div>} */}
			<button className={!snakeSpeed ? 'startButton' : 'restartButton'} onClick={startGame}>
				<span>{!snakeSpeed ? 'Start Game ' : 'Restart Game '}</span>
			</button>
		</div>
	);
};

export default App;

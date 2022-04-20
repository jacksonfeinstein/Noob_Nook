import React, { useCallback, useState } from "react";
import Stage from "./Pages/Stage";
import Display from "./Pages/Display";
import StartButton from "./Pages/StartButton";
import { checkCollision, createStage } from "./utils/GameHelpers";
import { StyledTetris, StyledTetrisWrapper } from "./utils/StyledTetris";
import { usePlayer } from "./utils/usePlayer";
import { useStage } from "./utils/useStage";
import { useInterval } from "./utils/useInterval";
import { useGameStatus } from "./utils/useGameStatus";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import './utils/Game.css';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] =
        useGameStatus(rowsCleared);

    const movePlayer = (dir) => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const startGame = () => {
        setDropTime(1000);
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setGameStart(true);
        setScore(0);
        setRows(0);
        setLevel(0);
    };

    const drop = () => {
        if (rows > (level + 1) * 10) {
            setLevel((prev) => prev + 1);
            setDropTime(1000 / (level + 1) + 200);
        }
        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            if (player.pos.y < 1) {
                console.log("Game Over !!");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    };

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);


    return (
        <Grid container direction='column'>
        <div>

            <StyledTetrisWrapper
                role="button"
                tabIndex="0"
                onKeyDown={(e) => move(e)}
                onKeyUp={keyUp}
            >
                <Typography sx={{fontFamily: 'Pixel', fontSize: '40px', fontWeight: 'bold', textAlign: 'center', color: 'white', mt: 3}}>
                    TETRIS
                </Typography>
                <StyledTetris>
                    <Stage stage={stage} />
                    <aside>
                        {gameOver ? (
                            <Display gameOver={gameOver} text="Game Over" />
                        ) : (
                            <div>
                                <Display text={`Score: ${score}`} />
                                <Display text={`Rows: ${rows}`} />
                                <Display text={`Level: ${level}`} />
                            </div>
                        )}
                        <StartButton gameStart={gameStart} callBack={startGame} />
                    </aside>
                </StyledTetris>
                <div className="mobile-controls">
                    <div className="controls-wrapper">
                        <i
                            className="fas fa-chevron-up"
                            onTouchStart={() => {
                                if (!gameOver) {
                                    playerRotate(stage, 1);
                                }
                            }}
                        ></i>
                    </div>
                    <div className="controls-wrapper">
                        <i
                            className="fas fa-chevron-left"
                            onTouchStart={() => {
                                if (!gameOver) {
                                    movePlayer(-1);
                                }
                            }}
                        ></i>
                        <i
                            className="fas fa-chevron-down"
                            onTouchStart={() => {
                                if (!gameOver) {
                                    dropPlayer();
                                }
                            }}
                            onTouchEnd={() => {
                                if (!gameOver) {
                                    setDropTime(1000 / (level + 1) + 200);
                                }
                            }}
                        ></i>
                        <i
                            className="fas fa-chevron-right"
                            onTouchStart={() => {
                                if (!gameOver) {
                                    movePlayer(1);
                                }
                            }}
                        ></i>
                    </div>
                </div>
            </StyledTetrisWrapper>
        </div>
        </Grid>
    );
};

export default Tetris;
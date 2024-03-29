import React, { Component } from 'react'
import uuid from 'react-uuid';
import './panel.css';
import API from "../../../../../API_Interface/API_Interface";

let hs=0;
let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;


export default class Panel extends Component {

    state = {
        snakePositions : [{top:"0px", left:'0px'}, {top:"0px", left:"10px"}],
        direction:'ArrowRight',
        score:0,
        highScore: 1,
        gameOver: false
    }

    getCurrHS = () => {
        const api = new API();

        async function getUserHS() {
            const gameHSJSONString = await api.getSnakeHS(window.currentUserLoggedIn);
            console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
            console.log(gameHSJSONString.data[0]['HS_Snake']);
            hs = gameHSJSONString.data[0]['HS_Snake'];
            console.log(`hs=${hs}`);
            //this.setState({highScore:gameHSJSONString.data[0]['HS_Snake']});

            //return gameHSJSONString.data[0]['HS_Snake'];

        }
        return getUserHS();
    }

    init = (timeinterval)=>{
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.changeSnakePosition()
            this.snakeControl()
        }, 400);
    }


    changFoodPosition = ()=>{
        let positionLeft = Math.floor(Math.random()*29)*10;
        let positionTop = Math.floor(Math.random()*29)*10;
        const {foods} = this
        foods.style.left = positionLeft + "px"
        foods.style.top = positionTop + "px"

    }

    addSnakeLength = ()=>{
        const {direction} = this.state
        const {snakePositions} = this.state
        const lastTop = snakePositions[0].top
        const lastLeft = snakePositions[0].left;
        switch(direction){
            case "ArrowUp":
                this.setState({snakePositions:[{top:lastTop+10+"px", left:lastLeft},...snakePositions]})
                break;
            case "ArrowDown":
                this.setState({snakePositions:[{top:lastTop-10+"px", left:lastLeft},...snakePositions]})
                break;
            case "ArrowLeft":
                this.setState({snakePositions:[{top:lastTop, left:lastLeft+10+"px"},...snakePositions]})
                break;
            case "ArrowRight":
                this.setState({snakePositions:[{top:lastTop, left:lastLeft-10+"px"},...snakePositions]})
                break;
        }
    }


    checkEat = ()=>{
        const {snakePositions} = this.state
        const snakeHead = snakePositions[snakePositions.length-1]
        const headTop = snakeHead.top
        const headLeft = snakeHead.left
        const {foods} = this

        if(parseInt(foods.style.left) === parseInt(headLeft) && parseInt(foods.style.top) === parseInt(headTop)){
            const {score} = this.state
            this.setState({score:score+1})
            const {changeScore} = this.props
            changeScore(this.state.score)
            this.changFoodPosition()
            this.addSnakeLength()
        }
    }

    checkDie = ()=>{
        this.getCurrHS();
        const {snakePositions} = this.state
        const snakeHead = snakePositions[snakePositions.length-1]
        const headTop = snakeHead.top
        const headLeft = snakeHead.left

        const score = this.state.score;
        const {getHS} = this.state.highScore;

        if(parseInt(headTop) < 0 || parseInt(headTop) > 290 || parseInt(headLeft) < 0 || parseInt(headLeft) > 290){
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime = date+' '+time;
            const api = new API();
            async function deletePost() {
                const gameHSJSONString = await api.deleteUserPost( window.currentUserLoggedIn, "is playing Snake!");
                console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
            }
            deletePost();
            if (score > hs){
                const api = new API();

                async function makeNewScore() {
                    const gameHSJSONString = await api.postNewHighScoreSnake(score, window.currentUserLoggedIn);
                    console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                    //setCurrHighScore(gameHSJSONString.data);

                }
                async function newHSPost() {
                    const gameHSJSONString = await api.postNewGameStatus( window.currentUserLoggedIn, `scored ${score} points in Snake and beat their high score!`, dateTime);
                    console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                }
                newHSPost();
                makeNewScore();
            }
            else {
                async function newGamePost() {
                    const gameHSJSONString = await api.postNewGameStatus( window.currentUserLoggedIn, `scored ${score} points in Snake but didn't beat their high score :(`, dateTime);
                    console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                }
                newGamePost();
            }
            if (this.state.gameOver){
                return
            }
            alert("Game Over")
            clearInterval(this.timer)
            this.setState({gameOver: true})
            return
        }

        for(let i = 0; i <= snakePositions.length-2; i ++){
            if (this.state.gameOver){
                return
            }
            else{
                console.log('game not over')
            }
            if(snakePositions[i].top === headTop && snakePositions[i].left === headLeft){
                let today = new Date();
                let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                let dateTime = date+' '+time;
                const api = new API();
                async function deletePost() {
                    const gameHSJSONString = await api.deleteUserPost( window.currentUserLoggedIn, "is playing Snake!");
                    console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                }
                deletePost();
                if (score > hs){
                    const api = new API();

                    async function makeNewScore() {
                        const gameHSJSONString = await api.postNewHighScoreSnake(score, window.currentUserLoggedIn);
                        console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                        //setCurrHighScore(gameHSJSONString.data);

                    }
                    async function newHSPost() {
                        const gameHSJSONString = await api.postNewGameStatus( window.currentUserLoggedIn, `scored ${score} points in Snake and beat their high score  °˖✧◝(⁰▿⁰)◜✧˖°`, dateTime);
                        console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                    }
                    newHSPost();
                    makeNewScore();
                }
                else {
                    async function newGamePost() {
                        const gameHSJSONString = await api.postNewGameStatus( window.currentUserLoggedIn, `scored ${score} points in Snake but didn't beat their high score  ‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚`, dateTime);
                        console.log(`routes from the DB ${JSON.stringify(gameHSJSONString)}`);
                    }
                    if (score !== 0)
                        newGamePost();
                }
                alert("Game Over")
                clearInterval(this.timer)
                this.setState({gameOver: true})
                return
            }
        }
    }


    changePositionByDirection = (direction)=>{
        const snakePositions = this.state.snakePositions
        const snakeHead = snakePositions[snakePositions.length-1]
        const beforeTop = parseInt(snakeHead.top)
        const beforeLeft = parseInt(snakeHead.left)

        snakePositions.shift()
        let newTop = beforeTop
        let newLeft = beforeLeft
        let newSnakePositions = []
        switch(direction){
            case "ArrowUp":
                newTop = beforeTop - 10 + "px"
                newLeft = beforeLeft + "px"
                break;
            case "ArrowDown":
                newTop = beforeTop + 10 + "px"
                newLeft = beforeLeft + "px"
                break;
            case "ArrowLeft":
                newTop = beforeTop + "px"
                newLeft = beforeLeft - 10 + "px"
                break;
            case "ArrowRight":
                newTop = beforeTop + "px"
                newLeft = beforeLeft + 10 + "px"
                break;
        }
        newSnakePositions = [...snakePositions,{top:newTop, left:newLeft}]
        this.setState({snakePositions:newSnakePositions})
        this.checkDie()
        this.checkEat()
    }

    changeSnakePosition = () => {
        const {direction} = this.state
        this.changePositionByDirection(direction)
    }


    snakeControl = ()=>{
        if (this.state.gameOver){
            return;
        }
        else{
            console.log('game is not over')
        }
        window.onkeydown = (e)=>{
            switch(e.key){
                case "ArrowUp":
                    if(this.state.direction !== "ArrowDown"){
                        this.setState({direction:'ArrowUp'})
                        this.changeSnakePosition()
                    }
                    break
                case "ArrowDown":
                    if(this.state.direction !== "ArrowUp"){
                        this.setState({direction:'ArrowDown'})
                        this.changeSnakePosition()
                    }
                    break
                case "ArrowLeft":
                    if(this.state.direction !== "ArrowRight"){
                        this.setState({direction:'ArrowLeft'})
                        this.changeSnakePosition()
                    }
                    break
                case "ArrowRight":
                    if(this.state.direction !== "ArrowLeft"){
                        this.setState({direction:'ArrowRight'})
                        this.changeSnakePosition()
                    }
                    break
            }
        }
    }

    render() {
        const {snakePositions} = this.state
        return (
            <div className='panel'>
                <div className='stage'>
                    <div className='snake' ref = {c=>this.snake = c} style={{left:'0px', top:'0px'}}>
                        {
                            snakePositions.map((snakeItem)=>{
                                return <div key={uuid()} style={{left:snakeItem.left, top:snakeItem.top}}></div>
                            })
                        }
                    </div>
                    <div className="food" ref={c => this.foods = c} onClick = {this.changFoodPosition}  style={{left:'10px', top:'10px'}}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        )
    }
}
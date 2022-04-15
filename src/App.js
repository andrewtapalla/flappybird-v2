import './App.css';
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { useState, useEffect } from 'react'


import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

import Join from './Components/Join/Join'
import Chat from './Components/Chat/Chat'

const bird_size = 20;
const game_width = 500;
const game_height = 500;
const gravity = 4;
const jump = 70;
const pipe_width = 40;
const pipe_gap = 200;

function App() {

  const [birdPosition, setBirdPosition] = useState(250);
  const [birdTwoPosition, setBirdTwoPosition] = useState(220);
  const [gameStarted, setGameStarted] = useState(false)
  const [pipeHeight, setPipeHeight] = useState(200);
  const [LeftPipe, setLeftPipe] = useState(game_width - pipe_width);
  const [score, setScore] = useState(-1)
  
  const bottomPipeHeight = game_height - pipe_gap - pipeHeight;

  //BIRD POSITION
  useEffect(() => {
  let timeId;
    if (gameStarted && birdPosition && birdTwoPosition < game_height - bird_size) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + gravity);
        setBirdTwoPosition((birdTwoPosition) => birdTwoPosition + gravity);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    }
  }, [birdPosition, birdTwoPosition, gameStarted]);

  //BIRD MOVEMENT & GAME START
  const handleClick = () => {
    let newBirdPosition = birdPosition - jump;
      if(!gameStarted) {
        setGameStarted(true);
      } else if (newBirdPosition < 0) {
        newBirdPosition(0)
      } else {
        setBirdPosition(newBirdPosition)
      }
    }

  const handleClickTwo = () => {
    let newBirdTwoPosition = birdTwoPosition - jump;
      if(!gameStarted) {
        setGameStarted(true);
      } else if (newBirdTwoPosition < 0) {
        newBirdTwoPosition(0)
      } else {
        setBirdTwoPosition(newBirdTwoPosition)
      }
    }
  

  //GENERATE PIPE
  useEffect(() => {
    let obstacleId;
    if (gameStarted && LeftPipe >= -pipe_width) {
      obstacleId = setInterval(() => {
        setLeftPipe ((LeftPipe) => LeftPipe - 5);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      }
    }
    else {
      setLeftPipe(game_width - pipe_width);
      setPipeHeight(Math.floor(Math.random() *(game_height - pipe_gap))
      );
      setScore(score => score + 1)
    }
  }, [gameStarted, LeftPipe]);

  //COLLISION
  useEffect(() => {
    const TopCollision = birdPosition >= 0 && birdPosition < pipeHeight;
    const BottomCollision = birdPosition <= 500 && birdPosition >= 500 - bottomPipeHeight;
    
    if(
      LeftPipe >= 0 && 
      LeftPipe <= pipe_width && 
      (TopCollision || BottomCollision)
      ) {
      setGameStarted(false)
    }
  }, [birdPosition, pipeHeight, bottomPipeHeight, LeftPipe]);

  return (
  <>
    <Container>
    <Div onClick={handleClick}>
    <GameScreen height={game_height} width={game_width}>
      <Obstacle top={0} width={pipe_width} height={pipeHeight} left={LeftPipe} />
      <Obstacle top={game_height - (pipeHeight + bottomPipeHeight)} width={pipe_width} height={bottomPipeHeight} left={LeftPipe} />
      <Bird size={bird_size} top={birdPosition}/>
      <BirdTwo size={bird_size} top={birdTwoPosition}/>
    </GameScreen>
    <span> {score} </span>
    </Div>
    <br />
    <div>
      <Button variant="primary" href="/">Join</Button>
      <br />
      <Button variant="primary" href="/chat">Chat</Button>
      {/* <Button variant="primary" href="/FlappyBird">FlappyBird</Button> */}
    <Router>
      <Routes>
        {/* <Route path="/" element={<Join />} /> */}
        <Route path="/" exact component={Join} element={<Join />} />
        {/* <Route path="/chat" component={<Chat />} /> */}
        <Route path="/chat" component={Chat} />
      </Routes>
    </Router>
    </div>
    </Container>
  </>
  );
}

const Bird = styled.div`
position: absolute;
background-color: red;
height: ${(props) => props.size}px;
width: ${(props) => props.size}px;
top: ${(props) => props.top}px;
border-radius: 50%;
`;

const BirdTwo = styled.div`
position: absolute;
background-color: Blue;
height: ${(props) => props.size}px;
width: ${(props) => props.size}px;
top: ${(props) => props.top}px;
border-radius: 50%;
`;

const Div = styled.div`
display: flex;
width: 100%;
justify-content: center;

& span {
  color: white;
  font-size: 24px;
  position: absolute;
}
`;

const GameScreen = styled.div`
height: ${(props) => props.height}px;
width: ${(props) => props.width}px;
background-color: black;
overflow: hidden;
`
const Obstacle = styled.div`
position: relative;
top: ${(props) => props.top}px;
background-color: green;
width: ${(props) => props.width}px;
height: ${(props) => props.height}px;
left: ${(props) => props.left}px;
`


export default App;
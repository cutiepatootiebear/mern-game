import React from "react";
import axios from "axios";
import USAMap from "react-usa-map";
import "../app.css";
import { runInThisContext } from "vm";

let postsAxios = axios.create();

postsAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      correctAnswers: [],
      wrongAnswers: [],
      scores: [],
      startingHiScore: 0,
      highScore: 0,
      randomState: "",
      message: ""
    };
  }

  componentDidMount() {
    this.getScores();
    // setTimeout(this.setHighScore, 200)
    axios.get("/states").then(res => {
      let randomNum = Math.floor(Math.random() * 52 + 1);
      this.setState({
        randomState: res.data[randomNum].abbreviation
      });
    });
  }

  getScores = () => {
    postsAxios.get("/api/scores").then(res => {
      const mappedData = res.data.map(obj => obj.score);
      this.setState(prevState => ({
        scores: [...prevState.scores, ...mappedData],
        highScore: Math.max(...[...prevState.scores, ...mappedData])
      }));
    });
  };

  randomState = () => {
    let randomNum = Math.floor(Math.random() * 51 + 1);
    axios.get("/states").then(res => {
      this.setState({
        randomState: res.data[randomNum].abbreviation
      });
    });
  };

  mapHandler = event => {
    if (event.target.dataset.name !== this.state.randomState) {
      if (this.state.wrongAnswers.length > 1) {
        const newScore = {
          score: this.state.correctAnswers.length
        };
        postsAxios.post("/api/scores", newScore).then(res => {
          this.gameOver();
        });
      } else {
        this.setState(prevState => ({
          wrongAnswers: [...prevState.wrongAnswers, "1"]
        }));
        alert("Oops! Try again");
      }
    } else {
      this.setState(prevState => ({
        correctAnswers: [...prevState.correctAnswers, "1"]
      }));
      alert("Correct! Keep going!");
      this.randomState();
    }
    // alert(event.target.dataset.name)
  };

  gameOver = () => {
    alert("GAME OVER\nScore successfully uploaded");
    this.setState({
      wrongAnswers: [],
      correctAnswers: []
    });
  };

  render() {
    return (
      <div>
        <p className="title">After 3 wrong answers it's game over!</p>
        <p className="title2">Find the following:</p>
        <p className="randomState">{this.state.randomState}</p>
        <div className="flexStuff">
          <p className="scoreText">Your Highest Score:</p>
          <p className="highScore">{this.state.highScore ? this.state.highScore !== null}</p>
          <p className="scoreText2">Score:</p>
          <p className="score">{this.state.correctAnswers.length}</p>
          <p className="scoreText2">Incorrect:</p>
          <p className="wrongAns">{this.state.wrongAnswers.length}</p>
        </div>
        <p className="msg">{this.state.message}</p>
        <div className="map">
          <USAMap onClick={this.mapHandler} />
        </div>
      </div>
    );
  }
}

export default Game;

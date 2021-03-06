import React, { Component } from "react";
import axios from "axios";
import {
  ComposableMap,
  ZoomableGlobe,
  Geographies,
  Geography,
  Graticule,
  Markers,
  Marker
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import cities from "../static/world-most-populous-cities.json";
import svgMap from "../static/world-110m.json";

let postsAxios = axios.create();

postsAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const populationScale = scaleLinear()
  .domain([10750000, 37843000])
  .range([5, 22]);

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

class AlbersUSA extends Component {
  constructor() {
    super();
    this.state = {
      correctAnswers: [],
      wrongAnswers: [],
      scores: [],
      message: "",
      highScore: 0,
      randomState: cities[Math.floor(Math.random() * 30 + 1)]
    };
  }

  componentDidMount() {
    this.getScores();
  }

  getScores = () => {
    postsAxios.get("/api/city-scores").then(res => {
      const mappedData = res.data.map(obj => obj.score);
      this.setState(prevState => ({
        scores: [...prevState.scores, ...mappedData],
        highScore: Math.max(...[...prevState.scores, ...mappedData])
      }));
    });
  };

  setHighScore = () => {
    console.log(this.state.scores);
    this.setState({
      highScore: Math.max(...this.state.scores)
    });
  };

  randomState = () => {
    let randomNum = Math.floor(Math.random() * 30 + 1);

    this.setState({
      randomState: cities[randomNum]
    });
  };

  mapHandler = event => {
    if (event.name !== this.state.randomState.name) {
      if (this.state.wrongAnswers.length > 1) {
        const newScore = {
          score: this.state.correctAnswers.length
        };
        postsAxios.post("/api/city-scores", newScore).then(res => {
          this.gameOver();
        });
      } else {
        this.setState(prevState => ({
          wrongAnswers: [...prevState.wrongAnswers, "1"]
        }));
        alert("You are incorrect. Try again.");
      }
    } else {
      this.setState(prevState => ({
        correctAnswers: [...prevState.correctAnswers, "1"]
      }));
      alert("Correct! Keep going!");
      this.randomState();
    }
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
      <div style={wrapperStyles}>
        <div className="App">
          <div className="flexStuff-globe">
            <p className="globe-scoreText">Your Highest Score:</p>
            <p className="globe-highScore">{this.state.highScore}</p>
            <p className="globe-scoreText2">Score:</p>
            <p className="globe-score">{this.state.correctAnswers.length}</p>
            <p className="globe-scoreText2">Incorrect:</p>
            <p className="globe-wrongAns">{this.state.wrongAnswers.length}</p>
          </div>
          <h1 className="dynamicText">
            Find {this.state.randomState ? this.state.randomState.name : ""} !{" "}
          </h1>
        </div>
        <ComposableMap
          projection="orthographic"
          projectionConfig={{
            scale: 300
          }}
          width={800}
          height={800}
          style={{
            width: "100%",
            height: "auto"
          }}
        >
          <ZoomableGlobe center={[96, 32]}>
            <circle cx={400} cy={400} r={300} fill="#001f3f" stroke="#eceff1" />
            <Geographies
              geography={svgMap}
              disableOptimization
            >
              {(geographies, projection) =>
                geographies.map((geography, i) => {
                  return (
                    <Geography
                      key={i}
                      onClick={() => {
                      }}
                      round
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none"
                        },
                        hover: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none"
                        },
                        pressed: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
            <Markers>
              {cities.map(city => {
                const radius = populationScale(city.population);
                return (
                  <Marker
                    onClick={e => {
                      console.log("city", city);
                      console.log("e", e);
                      this.mapHandler(e);
                    }}
                    key={city.name}
                    marker={city}
                    style={{
                      default: { opacity: 0.8 },
                      hidden: { display: "none" }
                    }}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={radius}
                      fill="#FF5722"
                      stroke="#FFF"
                    />
                    <circle
                      cx={0}
                      cy={0}
                      r={radius + 2}
                      fill="transparent"
                      stroke="#FF5722"
                    />
                  </Marker>
                );
              })}
            </Markers>
          </ZoomableGlobe>
        </ComposableMap>
      </div>
    );
  }
}

export default AlbersUSA;

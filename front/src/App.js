import React, { Component } from "react";
import './App.css';
import MainMenu from "./Screens/MainMenu.js";
import TeamSelection from "./Screens/TeamSelection";
import GameRoom from "./Screens/GameRoom"
import Results from "./Screens/Results"
import { connect } from "react-redux";
import { create_client} from "./Actions/GameActions";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createMuiTheme({
  palette: {
      primary: {
          main:'#056d79',
          dark: '#0a3f40',
          contrastText: 'white'
      },
      secondary:{
          main:'#ff5722',
          dark:'#a03715',
          contrastText: 'white'
      },
      // text:{
      //     primary:'#056d79',
      //     secondary: '#056d79',
      //     disabled:'#056d79'
      // },
      // action:{
      //     hover: '#ff5722',
      //     disabled: '#ff5722',
      //     selected: '#ff5722',
      //     active: '#ff5722'
      // }
  },
});

class App extends Component {
  componentWillMount() {
    this.props.create_client('ws://localhost:2567');
  }

  componentWillUnmount() {
      if (localStorage.getItem('room') !== undefined && localStorage.getItem('room') !== null)
          localStorage.setItem('lastChanged', new Date().getTime().toString());
  }

  constructor() {
      super();
      this.state={
          emptyCards:false
      }
  }

  render()
  {
      console.log('in app js', this.props)

      // let screen = <TeamSelection gameState={temp} room={{id:"XYZW8"}} playerId={"BfRHt2x-C"}/>;
      // if (!this.state.emptyCards)
          // setTimeout(()=> {temp["current_game"]["played_cards"] = []; console.log("hi");this.setState({emptyCards:true})}, 2000)
      // let screen = <GameRoom gameState={temp} room={{id:"XYZW8"}} playerId={"csLNH7tf8"} passKey="917dfe776745e115d382a24dbafde31c"/>;

      // screen = <Results gameState={temp}/>
      return <div> hi </div>
      // let screen = <MainMenu/>;
      // if(this.props.gameState.state === "not_started" && this.props.room !== undefined)
      //     screen = <TeamSelection/>;
      // if(this.props.gameState.state === "started" && this.props.room !== undefined)
      //     screen = <GameRoom/>;
      // if(this.props.gameState.state === "finished")
      //     screen = <Results/>;
      // if (this.props.gameState.state === "pending")
      // {
      //     if(this.props.gameState.players[this.props.playerId].position_at_table === 0 || !this.props.gameState.players[this.props.playerId].ready )
      //         screen = <TeamSelection/>;
      //     else
      //         screen = <GameRoom/>;
      // }
      // return (
      //     <MuiThemeProvider theme={theme}>
      //         {screen}
      //     </MuiThemeProvider>
      // );
  }
}



const mapStateToProps = state => {
  return state.AppReducer;
};

const mapDispatchToProps = dispatch => {
  return {
      create_client: () => dispatch(create_client()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


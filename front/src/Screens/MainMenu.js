import React, {Component} from "react";
import "./CSS/MainMenu.scss";
import {connect} from "react-redux";
import {create_room, join_room, reconnect, is_room_available} from "../Actions/GameActions";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"

class MainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomName: '',
            roomNameError: false,
            userName: '',
            userNameError: false,
            hasJoker: false,
            maxScore: 1200,
            reconnectRoom: undefined

        };


    }

    componentDidMount(){
        if (localStorage.getItem('room') !== undefined && localStorage.getItem('room') !== null) {
            let room = JSON.parse(localStorage.getItem('room'))
            console.log(room)
            this.props.is_room_available(room.id)
            this.setState({reconnectRoom: room});
            setTimeout(()=> this.setState({reconnectRoom:undefined}), 60*1000)
        }
    }

    handleRoomChange = (event) => {
        this.setState({roomName: event.target.value});
        this.setState({roomNameError: false});
    };

    handleNameChange = (event) => {
        this.setState({userName: event.target.value});
        this.setState({userNameError: false});
    };

    handleJokerChange = (event) => {
        this.setState({hasJoker: !this.state.hasJoker});
    };

    handleMaxScoreChange = (event) => {
        this.setState({maxScore: event.target.value});
    };

    handleCreate() {
        if (this.state.userName.length < 1)
            this.setState({userNameError: true});
        else
            this.props.create_room(this.props.client, this.props.room, this.state.userName, this.state.hasJoker, this.state.maxScore);
    };

    handleJoin() {
        if (this.state.userName.length < 1)
            this.setState({userNameError: true});
        else if (this.state.roomName.length < 5)
            this.setState({roomNameError: true});
        else
            this.props.join_room(this.props.client, this.state.roomName, this.props.room, this.state.userName)
    }


    render() {
        // console.log("available rooms", this.props.client.getAvailableRooms())
        let reconnectBanner = null;
        if (this.state.reconnectRoom !== undefined && this.props.reconnectRoom === true) {
            reconnectBanner = <div id="reconnect"><p> Reconnect to room {this.state.reconnectRoom.id}</p>
                <Button variant="contained" color="secondary"
                        onClick={() => this.props.reconnect(this.props.client, this.state.reconnectRoom.id, this.state.reconnectRoom.sessionId)}>Reconnect</Button>
            </div>
        }
        return (
            <div id={"MainMenu"}>
                <div>
                    {reconnectBanner}
                    <div id={"playerName"}>
                        <TextField label="Name" variant="outlined" fullWidth
                                   onChange={this.handleNameChange}
                                   error={this.state.userNameError}
                                   InputProps={{style: {borderColor: "white"}}}
                                   helperText={this.state.userNameError ? "Invalid user name" : undefined}
                        />
                    </div>
                    <div id={"signForm"}>
                        <div id={"create"}>
                            <h3> Create Game </h3>
                            <div id={"settings"}>
                                <div className={"setting-item"}>
                                    <p>Joker</p>
                                    <Checkbox
                                        checked={this.state.hasJoker}
                                        onChange={this.handleJokerChange}
                                        color="secondary"
                                    />
                                </div>
                                <div className={"setting-item"}>
                                    <p>Final Score</p>
                                    <TextField type="number" inputProps={{
                                        min: "330",
                                        max: "3000",
                                        step: "5",
                                        style: {textAlign: 'center'}
                                    }}
                                               defaultValue={1200} style={{maxWidth: "3em", textAlign: 'center'}}
                                               onChange={this.handleMaxScoreChange}
                                               disabled={false}
                                    />
                                </div>

                            </div>
                            <Button variant="contained" color="secondary" onClick={() => this.handleCreate()}>
                                Create Room
                            </Button>
                        </div>
                        <div id={"join"}>
                            <h3> Join Game </h3>
                            <TextField type="text" onChange={this.handleRoomChange}
                                       variant="outlined"
                                       error={this.state.roomNameError}
                                       helperText={this.state.roomNameError ? "should contain 5 characters" : undefined}
                                       onInput={(e) => e.target.value = ("" + e.target.value).toUpperCase()}
                                       label="room code"/>
                            <Button variant="contained" color="secondary" onClick={() => this.handleJoin()}>Join
                                Room</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.AppReducer;
};

const mapDispatchToProps = dispatch => {
    return {
        create_room: (client, room, userName, hasJoker, maxScore) => dispatch(create_room(client, room, userName, hasJoker, maxScore)),
        join_room: (client, room_id, room, roomName) => dispatch(join_room(client, room_id, room, roomName)),
        reconnect: (client, roomId, sessionId) => dispatch(reconnect(client, roomId, sessionId)),
        is_room_available: (roomId) => dispatch(is_room_available(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);


//
//
//
//
//
// import React from 'react';
// import {
//     fade,
//     ThemeProvider,
//     withStyles,
//     makeStyles,
//     createMuiTheme,
// } from '@material-ui/core/styles';
// import InputBase from '@material-ui/core/InputBase';
// import InputLabel from '@material-ui/core/InputLabel';
// import TextField from '@material-ui/core/TextField';
// import FormControl from '@material-ui/core/FormControl';
// import { green } from '@material-ui/core/colors';
//
// const CssTextField = withStyles({
//     root: {
//         '& label.Mui-focused': {
//             color: 'green',
//         },
//         '& .MuiInput-underline:after': {
//             borderBottomColor: 'green',
//         },
//         '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//                 borderColor: 'red',
//             },
//             '&:hover fieldset': {
//                 borderColor: 'yellow',
//             },
//             '&.Mui-focused fieldset': {
//                 borderColor: 'green',
//             },
//         },
//     },
// })(TextField);
//
// const BootstrapInput = withStyles((theme) => ({
//     root: {
//         'label + &': {
//             marginTop: theme.spacing(3),
//         },
//     },
//     input: {
//         borderRadius: 4,
//         position: 'relative',
//         backgroundColor: theme.palette.common.white,
//         border: '1px solid #ced4da',
//         fontSize: 16,
//         width: 'auto',
//         padding: '10px 12px',
//         transition: theme.transitions.create(['border-color', 'box-shadow']),
//         // Use the system font instead of the default Roboto font.
//         fontFamily: [
//             '-apple-system',
//             'BlinkMacSystemFont',
//             '"Segoe UI"',
//             'Roboto',
//             '"Helvetica Neue"',
//             'Arial',
//             'sans-serif',
//             '"Apple Color Emoji"',
//             '"Segoe UI Emoji"',
//             '"Segoe UI Symbol"',
//         ].join(','),
//         '&:focus': {
//             boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
//             borderColor: theme.palette.primary.main,
//         },
//     },
// }))(InputBase);
//
// const useStylesReddit = makeStyles((theme) => ({
//     root: {
//         border: '1px solid #e2e2e1',
//         overflow: 'hidden',
//         borderRadius: 4,
//         backgroundColor: '#fcfcfb',
//         transition: theme.transitions.create(['border-color', 'box-shadow']),
//         '&:hover': {
//             backgroundColor: '#fff',
//         },
//         '&$focused': {
//             backgroundColor: '#fff',
//             boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
//             borderColor: theme.palette.primary.main,
//         },
//     },
//     focused: {},
// }));
//
// function RedditTextField(props) {
//     const classes = useStylesReddit();
//
//     return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
// }
//
// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     margin: {
//         margin: theme.spacing(1),
//     },
// }));
//
// const ValidationTextField = withStyles({
//     root: {
//         '& input:valid + fieldset': {
//             borderColor: 'green',
//             borderWidth: 2,
//         },
//         '& input:invalid + fieldset': {
//             borderColor: 'red',
//             borderWidth: 2,
//         },
//         '& input:valid:focus + fieldset': {
//             borderLeftWidth: 6,
//             padding: '4px !important', // override inline-style
//         },
//     },
// })(TextField);
//
// const theme = createMuiTheme({
//     palette: {
//         primary: green,
//     },
// });
//
// export default function CustomizedInputs() {
//     const classes = useStyles();
//
//     return (
//         <form className={classes.root} noValidate>
//             <CssTextField className={classes.margin} id="custom-css-standard-input" label="Custom CSS" />
//             <CssTextField
//                 className={classes.margin}
//                 label="Custom CSS"
//                 variant="outlined"
//                 id="custom-css-outlined-input"
//             />
//             <ThemeProvider theme={theme}>
//                 <TextField
//                     className={classes.margin}
//                     label="ThemeProvider"
//                     id="mui-theme-provider-standard-input"
//                 />
//                 <TextField
//                     className={classes.margin}
//                     label="ThemeProvider"
//                     variant="outlined"
//                     id="mui-theme-provider-outlined-input"
//                 />
//             </ThemeProvider>
//             <FormControl className={classes.margin}>
//                 <InputLabel shrink htmlFor="bootstrap-input">
//                     Bootstrap
//                 </InputLabel>
//                 <BootstrapInput defaultValue="react-bootstrap" id="bootstrap-input" />
//             </FormControl>
//             <RedditTextField
//                 label="Reddit"
//                 className={classes.margin}
//                 defaultValue="react-reddit"
//                 variant="filled"
//                 id="reddit-input"
//             />
//             <InputBase
//                 className={classes.margin}
//                 defaultValue="Naked input"
//                 inputProps={{ 'aria-label': 'naked' }}
//             />
//             <ValidationTextField
//                 className={classes.margin}
//                 label="CSS validation style"
//                 required
//                 variant="outlined"
//                 defaultValue="Success"
//                 id="validation-outlined-input"
//             />
//         </form>
//     );
// }
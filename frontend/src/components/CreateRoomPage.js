import React, { Component} from 'react';
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Collapse } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";


export default class CreateRoomPage extends Component{
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }

    constructor(props){
        super(props);
        this.state = {
            guestCanPause:this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: ""
        };
        this.handleRoomButtonPress = this.handleRoomButtonPress.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }
    handleVotesChange(e){
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause: e.target.value === 'true' ? true : false,
        });
        
    }

    handleUpdateButtonPressed() {
        const requestOptions = {
            method: 'patch',
            headers: {'Content-type': 'application/json' },
            body: JSON.stringify({
                guest_can_pause: this.state.guestCanPause,
                votes_to_skip: this.state.votesToSkip,
                code : this.props.roomCode
            })
        };
        fetch('/api/update-room',requestOptions)
        .then((response) => {
            if(response.ok){
                this.setState({
                    successMsg : "Room Updated successfully!",
                })
            }else {
                this.setState({
                    errorMsg : "Error Updating room!",
                })
            }
            this.props.updateCallback();
        } )
        
    }

    handleRoomButtonPress(){

        const requestOptions = {
            method: 'POST',
            headers: {'Content-type': 'application/json' },
            body: JSON.stringify({
                guest_can_pause: this.state.guestCanPause,
                votes_to_skip: this.state.votesToSkip
            })
        };
        fetch('/api/create', requestOptions)
        .then((response) => response.json())
        .then((data) => this.props.history.push('/room/' + data.code));
    }

    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color='secondary' variant='contained' onClick={this.handleRoomButtonPress}>Create a Room</Button> 
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color='primary' variant='contained' to="/" component={Link}>Back</Button> 
                </Grid>
            </Grid>
        )
    }

    renderUpdateButtons() {
        return(
            <Grid item xs={12} align="center">
                    <Button color='secondary' 
                    variant='contained' 
                    onClick={this.handleUpdateButtonPressed}>Update Room</Button> 
            </Grid>
        )
    }

    render(){
        const title = this.props.update ? "Update Room" : "Create a Room"

        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errorMsg !="" || this.state.successMsg !=""}>
                        {this.state.successMsg != "" ? (
                        <Alert severity='success' onClose={ ()=>{
                            this.setState({successMsg: ""})
                        }}
                        >
                            {this.state.successMsg}
                        </Alert>
                        ) : (
                        <Alert severity='error'onClose={ ()=>{
                            this.setState({errorMsg: ""})
                        }}
                        >
                            {this.state.errorMsg}</Alert>
                        ) }
                    </Collapse>
                </Grid>
        <Grid item xs={12} align="center">
            <Typography component='h4' variant='h4'>
                { title }
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText>
                    <div align='center'>
                        Guest Control of PlayBack state
                    </div>
                </FormHelperText>
                <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                    <FormControlLabel value="true" control={ <Radio color="primary"/>}
                    label="Play/Pause"
                    labelPlacement='bottom'/>
                    <FormControlLabel value="false" control={ <Radio color="secondary"/>}
                    label="No Control"
                    labelPlacement='bottom'/>
                </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField 
                required={true} 
                type ="number"
                onChange={this.handleVotesChange}
                defaultValue={this.state.votesToSkip}
                inputProps={{
                    min: 1,
                    style: {textAlign: "center"},
                }}
                />
                <FormHelperText>
                    <div align="center">
                       votes required to Skip 
                    </div>
                </FormHelperText>
            </FormControl>
        </Grid>
         {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons() }

    </Grid>
        )
    }
}
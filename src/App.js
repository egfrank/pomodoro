import React from 'react';
import './App.css';



const DEFAULT_STATE = {
        break: 5,
        session: 25,
        playing: false,
        modeIsSession: true,
}

DEFAULT_STATE['time'] = DEFAULT_STATE['session'] * 60;



const TIME_INTERVAL = 1000;


function NumberSelector({label, 
                         defaultNum, 
                         decrement,
                         increment,
                         id}){
  return (
    <div>
        <h3 id={id+'-label'}>{label}</h3>
        <h4 id={id+'-length'}>{defaultNum}</h4>
        <div onClick={decrement} id={id+'-decrement'}>Decrease</div>
        <div onClick={increment} id={id+'-increment'}>Increase</div>
    </div>
    )
}








function Title(){
  return (<h1>Pomodoro Clock</h1>)
}

function Clock({modeIsSession, time}){
  return (
    <div>
      <h2 id='timer-label'>{modeIsSession ? 'Session' : 'Break'}</h2>
      <h1 id='time-left'>{convertSecondsToMMSS(time)}</h1>
    </div>
    )
}

function ControlPanel ({ togglePlaying, resetButton }){
  return (
    <div>
      <div id='start_stop' onClick={togglePlaying}>Play</div>
      <div id='reset' onClick={resetButton}>Reset</div>
    </div>
    )
}



class App extends React.Component {


  constructor(props){
    super(props);
    this.state = DEFAULT_STATE;

    this.incrementBreak = this.incrementBreak.bind(this);
    this.decrementBreak = this.decrementBreak.bind(this);

    this.incrementSession = this.incrementSession.bind(this);
    this.decrementSession = this.decrementSession.bind(this);

    this.resetButton = this.resetButton.bind(this);
    this.togglePlaying = this.togglePlaying.bind(this);

    this.audioRef = React.createRef();
  }


  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      TIME_INTERVAL,
    );
  }


  incrementBreak(){
    if ( this.state.break < 60  && !this.state.playing) {
      if (this.state.modeIsSession){
          this.setState({
            break: this.state.break + 1
          })
      } else {
          this.setState({
            break: this.state.break + 1,
            time: (this.state.break + 1)*60,
          })

      }
    }
  }

  decrementBreak(){
    if ( this.state.break > 1  && !this.state.playing) {
      if (this.state.modeIsSession){
          this.setState({
            break: this.state.break - 1
          })
      } else {
          this.setState({
            break: this.state.break - 1,
            time: (this.state.break - 1)*60,
          })

      }
    }
  }

  incrementSession(){
    if ( this.state.session < 60 && !this.state.playing) {
      if (this.state.modeIsSession){
      this.setState({
        session: this.state.session + 1,
        time: (this.state.session + 1)*60,
      })
    } else {
      this.setState({
        session: this.state.session + 1,
      })
    }
  }
}

  decrementSession(){
    if ( this.state.session > 1  && !this.state.playing) {
      if (this.state.modeIsSession){
      this.setState({
        session: this.state.session - 1,
        time: (this.state.session - 1)*60,
      })
    } else {
      this.setState({
        session: this.state.session - 1,
      })
    }
  }

}
  togglePlaying(){
      this.setState({
        playing: !this.state.playing,
      })
      this.audioRef.current.pause()
      
  }

  playBeep(){
    this.audioRef.current.play();
  }


  tick(){
    if (this.state.playing && this.state.time >= 0) {
        this.setState({time: this.state.time-1})
    }

    if (this.state.playing && this.state.time === -1){
      if (this.state.modeIsSession){
      this.setState({
        modeIsSession: !this.state.modeIsSession,
        time: this.state.break*60,
      })
      this.playBeep();

    } else {
      this.setState({
        modeIsSession: !this.state.modeIsSession,
        time: this.state.session*60,
      })
      this.playBeep()
    }
  }
}

  resetButton() {
    this.setState(DEFAULT_STATE);
    this.audioRef.current.load()
  }


  render() {

  const sessionProps = {
    label: 'Session Length',
    id: 'session',
    defaultNum: this.state.session,
    increment: this.incrementSession,
    decrement: this.decrementSession,
  }

  const breakProps = {
    label: 'Break Length',
    id: 'break',
    defaultNum: this.state.break,
    increment: this.incrementBreak,
    decrement: this.decrementBreak,
  }

  const clockProps = {
    playing: this.state.playing,
    time: this.state.time,
    clockTick: this.clockTick,
    modeIsSession: this.state.modeIsSession,
  };



  const controlPanelProps = {
    togglePlaying: this.togglePlaying,
    resetButton: this.resetButton,
  }



  return (
    <div className="App">
      <Title />
      <NumberSelector {...breakProps} />
      <NumberSelector {...sessionProps} />
      <Clock {...clockProps}/>
      <ControlPanel {...controlPanelProps}/>
      <audio 
                ref={this.audioRef}
                id="beep"
                src="/beep.mp3"
                >
                Your browser does not support the <code>audio</code> element.
      </audio>    
    </div>

  )};
}

function convertSecondsToMMSS(secs){
    const mm = padZeros(Math.floor(secs / 60));
    const ss = padZeros(secs % 60);
    
    return `${mm}:${ss}`
    
}

function padZeros(time){
  if (time < 10){
       return `0${time}`
    } else {
       return `${time}`
    } 

}

export default App;



import React, { Component } from 'react';
import {Webcam} from 'react-webcam';



class WebcamCapture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          screenshot: null,
        };
        this.screenshot = null;
      }

    setRef = (webcam) => {
      this.webcam = webcam;
    }
  
    capture = () => {
        const screenshot = this.webcam.getScreenshot();
        this.setState({ screenshot });
        this.screenshot = screenshot;
    };
  
    render() {
      return (
        <div>
          <Webcam
            audio={false}
            height={720}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={720}
          />
          <button onClick={this.capture}>Capture photo</button>
        </div>
      );
    }
  }

  export default WebcamCapture;
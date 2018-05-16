import React, { Component } from 'react';
import * as firebase from 'firebase';
import CardMedia from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';


const styles = theme => ({
  width: '100vw',
  height: '40vh',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  verticalAlign: 'middle',
  display: 'table-cell',
  textAlign: 'center',
  media: {
    width: '100vw',
  },  
});

class ProgressiveCardImg extends Component {
  constructor(props) {
    super(props);
    this.src = props.gs_src;
  }

  render() {
    const classes = this.props.classes;
    var width = window.innerWidth;
    return (<img width={width} src={this.src}/>);       
  }
}

export default withStyles(styles) (ProgressiveCardImg);

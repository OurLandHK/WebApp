import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
    let width = '100%';
    return (<img width={width} src={this.src} alt="image"/>);
  }
}

export default withStyles(styles) (ProgressiveCardImg);

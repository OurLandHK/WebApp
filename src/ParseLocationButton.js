import React, { Component } from 'react';
import Button  from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { constant } from './config/default';
import {
  openSnackbar,
} from './actions';


const styles = theme => ({
    parseButton: {
      height: '80px',
      margin: '10px'
    }
  });

class ParseLocationButton extends Component {
  constructor(props) {
    super(props);
    this.handleParseLocationButtonClick = this.handleParseLocationButtonClick.bind(this);
  }

  handleParseLocationButtonClick() {
    this.props.handleParseLocationButtonClick();
    this.props.openSnackbar(`${constant.parseLocationSuccessMessage} ${this.props.parsedStreetAddress}`, "success");
  }

  render() {
    const { classes, isVisible, parsedStreetAddress  } = this.props;
    if(!isVisible) {
        return (null);
    }
    
    return (
        <React.Fragment>
            <Button
            className={classes.parseButton}
            variant="raised"
            color="secondary"
            onClick={this.handleParseLocationButtonClick}>
            {`${constant.parseLocationMessage} ${parsedStreetAddress} ${constant.parseSuffixMessage}`}
            </Button>
        </React.Fragment>    
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar:
      (message, variant) =>
        dispatch(openSnackbar(message, variant)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ParseLocationButton));

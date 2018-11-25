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

class ParseTimeButton extends Component {
  constructor(props) {
    super(props);
    this.handleParseTimeButtonClick = this.handleParseTimeButtonClick.bind(this);
  }

  handleParseTimeButtonClick() {
    this.props.handleParseTimeButtonClick();
    this.props.openSnackbar(`${constant.parseTimeSuccessMessage} ${this.props.parsedStartTime}`, "success");
  }


  render() {
    const { classes, isVisible, parsedStartTime } = this.props;
    if(!isVisible) {
        return (null);
    }
    
    return (
        <React.Fragment>
            <Button
            className={classes.parseButton}
            variant="raised"
            color="secondary"
            onClick={this.handleParseTimeButtonClick}>
            {`${constant.parseTimeMessage} ${parsedStartTime} ${constant.parseSuffixMessage}`}
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
)(withStyles(styles)(ParseTimeButton));

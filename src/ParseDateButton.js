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

class ParseDateButton extends Component {
  constructor(props) {
    super(props);
    this.handleParseDateButtonClick = this.handleParseDateButtonClick.bind(this);
  }

  handleParseDateButtonClick() {
    this.props.handleParseDateButtonClick();
    this.props.openSnackbar(`${constant.parseDateSuccessMessage} ${this.props.parsedStartDate}`, "success");
  }

  render() {
    const { classes, isVisible, parsedStartDate } = this.props;
    if(!isVisible) {
        return (null);
    }

    return (
        <React.Fragment>
            <Button
            className={classes.parseButton}
            variant="raised"
            color="secondary"
            onClick={this.handleParseDateButtonClick}>
            {`${constant.parseDateMessage} ${parsedStartDate} ${constant.parseSuffixMessage}`}
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
)(withStyles(styles)(ParseDateButton));

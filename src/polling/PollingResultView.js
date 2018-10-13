import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { constant } from '../config/default';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  root: {
     flexGrow: 1,
     paddingTop: '20px',
     paddingBottom: '20px',
  },
  dialogTitle: {
    position: 'relative',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  pollingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  metaDataContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollingResultContainer: {
    width: '100%',
    display: 'block',
    marginTop: '20px',
  },
  pollingTitle: {
    fontSize: '30px',
    fontWeight: 'bold'
  },
  resultBarContainer: {
    width: '100%',
    marginBottom: '20px',
    backgroundColor: '#eee'
  },
  resultBarTitle: {
    marginLeft: '5px'
  },
  resultBar: {
    textAlign: 'right',
    padding: '10px',
    color: 'white',
    backgroundColor: '#2196F3'
  }
});

class PollingResultView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  renderResultBar(title, precentage, val) {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.resultBarTitle}>{title}</div>
        <div className={classes.resultBarContainer}>
          <div className={classes.resultBar} style={{width: precentage + '%'}}>{val}</div>
        </div>
      </div>
    )
  }

  render() {
    const { classes, polling } = this.props;
    const { numOfMaxPollng, selectedOption } = this.state;

    const results = polling.result
                  .map(obj => obj.value)
                  .reduce((a, b) => {
                  Object.keys(b).forEach((idx) => {
                    a[idx] = (a[idx] || 0) + b[idx]
                  });
                  return a;
                }, {});
                console.log(results)

    const sum = Object.keys(results)
                .reduce( (a, b) => {
                  return a + results[b];
                }, 0)

    return (
      <Paper className={classes.root}>
        <Grid container className={classes.pollingContainer} spacing={0}>
          <Grid item >
            <div className={classes.pollingTitle}>
              {polling.pollingTitle}
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.metaDataContainer} spacing={0}>
          <Grid item >
            <div className={classes.numOfMaxPollng}>
              {constant.numOfPollingLabel}: {polling.result.length}
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.pollingResultContainer} spacing={0}>
          {
            polling.pollingOptionValues.map((val, idx) => {
              return this.renderResultBar(val, (results[idx] / sum)* 100, results[idx]);
            })
          }
        </Grid>
      </Paper>
    );
  }
}

PollingResultView.propTypes = {
  classes: PropTypes.object.isRequired,
  polling: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PollingResultView));

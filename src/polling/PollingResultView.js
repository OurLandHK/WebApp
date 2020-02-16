import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
    backgroundColor: '#ebeef1'
  },
  resultBarTitle: {
    marginLeft: '10px'
  },
  resultBar: {
    textAlign: 'right',
    padding: '10px 0px',
    color: 'white',
    backgroundColor: '#0090D9'
  },
  resultBarValue: {
    margin: '0px 10px',
    fontSize: '18px',
  }
});

class PollingResultView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: props.pollingResult,
    }
  }
/*
  componentDidMount() {
    const { polling, pollingResult } = this.props;
    const results = polling.results
                  .map(obj => obj.value)
                  .reduce((a, b) => {
                  Object.keys(b).forEach((idx) => {
                    a[idx] = (a[idx] || 0) + b[idx]
                  });
                  return a;
                }, {});

    const sum = Object.keys(results)
                .reduce( (a, b) => {
                  return a + results[b];
                }, 0)

    this.setState({
      results: results,
      sum: sum
    })
  }
*/

  renderResultBar(title, precentage, val) {
    const { classes } = this.props;
    var style = {
      width: precentage + '%'
    }

    if(parseInt(precentage) === 0) {
      style = {...style, color: '#000'}
    }

    return (
      <div>
        <div className={classes.resultBarTitle}>{title}</div>
        <div className={classes.resultBarContainer}>
          <div className={classes.resultBar} style={style}>
            <div className={classes.resultBarValue}>{val}</div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { classes, polling } = this.props;
    let numOfPolling = 0;
    if(this.state.results !== null) {
      numOfPolling = this.state.results['total'];
    }

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
            <div className={classes.numOfMaxPolling}>
              {constant.numOfPollingLabel}: {numOfPolling}
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.pollingResultContainer} spacing={0}>
          {
            polling.pollingOptionValues.map((val, idx) => {
              if(this.state.results === null) {
                return this.renderResultBar(val, 0, 0);
              } else {
                let vote = this.state.results['upvote'][idx];
                let total = this.state.results['total'];
                return this.renderResultBar(val, (vote / total)* 100, vote);
              }
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

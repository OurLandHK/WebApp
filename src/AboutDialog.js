import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const Transition = props => {
  return <Slide direction="left" {...props} />;
};

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  container: {
    overflowY: 'auto'
  }
};


class AboutDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.props.openDialog(this.openDialog.bind(this));
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  openDialog() {
    this.setState({ open: true });
  };

  handleRequestClose() {
    this.setState({ open: false });
  };


  render() {
    const { classes } = this.props;
    return (
      <Dialog fullScreen  open={this.state.open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>關於</Typography>           
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
        <p><b><a href="https://www.facebook.com/pg/HKOurLand">我地(ourland)</a></b> 係一個Neighbour Media (街坊媒體) 。用家可以查詢現在身處位置或地址簿內位置 1 公里範圍的社區事:</p>
        <ol>
        <li>公共設施</li>
        <li>社區活動</li>
        <li>社區議題</li>
        </ol>
        <p>街坊可以利用佢去匯報社區問題，或者跟進解決。當然社區參與者可以利用佢攪活動通知街坊，甚至把自已的聯絡方法罷上去俾人揾。。 </p>
        <p>我地會把大家的社區參與紀錄列出, 方便其他社區參與者參考及鼓勵大家作出行動。</p>
        </div>
      </Dialog>
    );
  };
}

export default withStyles(styles)(AboutDialog);

import React, { Component } from 'react';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import CloseIcon from 'material-ui-icons/Close';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';

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
        <p>
        <b>我地(ourland)</b> 係一個社區(事件，資源) 跟進系統。用家可以查詢現在身處位置或地址簿中1公里範圍的社區人和事。</p>
        <p>利用我地去活化社區及埋班係我地想見到，社區參與者可以透過我地去:</p>
        <p>匯報社區問題，或跟進解決</p>
        <p>攪活動通知其他社區參與者</p>
        <p>甚至成為社區幹事把自已的聯絡方法放喺我地度俾人揾。 </p>
        <p>我地會把大家的社區參與紀錄列出, 方便其他社區參與者參考及鼓勵大家作出行動。</p>
        </div>
      </Dialog>
    );
  };
}

export default withStyles(styles)(AboutDialog);

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
  return <Slide direction="right" {...props} />;
};

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
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
        <p>
        <b>我地(ourland)</b> 係一個location base社區(事件，資源) 跟進系統。用家可以查詢現在身處位置或address book的位置 1 km範圍的社區事項。社區參與者可以會報社區問題，或者跟進解決。當然社區參與者可以利用佢攪活動通知人甚至把自已的contact把上去俾人揾。 當區選發生時，大家可以利用呢個系統去列出自已的社區CV, 去選或都endorse人去選。 當然利用呢個系統去活發社區埋班係我地想見到。
        </p>
      </Dialog>
    );
  };
}

export default withStyles(styles)(AboutDialog);

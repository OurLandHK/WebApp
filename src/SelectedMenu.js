import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List, { ListItem, ListItemText } from '@material-ui/core/List';
import green from '@material-ui/core/colors/green';
import Menu, { MenuItem } from '@material-ui/core/Menu';


class SelectedMenu extends Component {
  constructor(props) {
    super(props);
    this.selectedValue = null;
    this.state = {
      anchorEl: undefined,
      open: false,
      selectedIndex: 0,
    };    
  }

  static defaultProps = {
    options : [
        'Show all notification content',
        'Hide sensitive notification content',
        'Hide all notification content',
      ],
    label: "Testing",
  }

  handleClickListItem = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, open: false });    
    this.selectedValue = this.props.options[index];
    if(this.props.changeSelection != null) {
      this.props.changeSelection(this.selectedValue);
    }
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    let listItemHtml = null;
    if(this.props.label == null || this.props.label == "") {
      listItemHtml = <ListItemText secondary={this.props.options[this.state.selectedIndex]}/>
    } else {
      listItemHtml = <ListItemText primary={this.props.label}  secondary={this.props.options[this.state.selectedIndex]}/>
    } 
    return (
      <div>
        <List borderColor='green[200]' backgroundColor='green[500]'>
          <ListItem
            borderColor='green[200]'
            width='100%'
            fontWeight='bold'
            color='#FFFFFF'
            backgroundColor='green[500]'
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label={this.props.label}
            onClick={this.handleClickListItem}
          >
            {listItemHtml}
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          {this.props.options.map((option, index) =>
            <MenuItem
              key={option}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>,
          )}
        </Menu>
      </div>
    );
  }
}

SelectedMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SelectedMenu;
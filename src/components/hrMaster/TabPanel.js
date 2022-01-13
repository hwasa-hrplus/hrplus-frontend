import { makeStyles, Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

import React, { Component } from 'react';


class TabPanel extends Component {
    render() {
      return (
        <Typography component="div" hidden={this.props.value !== this.props.index}>
          <Box p={3}>{this.props.children}</Box>
        </Typography>
      );
    }
  }
  export default TabPanel;
/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import Parallax from "../components/Parallax/Parallax";
import { withStyles } from "@material-ui/core";
import styles from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";


class Contact extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Parallax image={require("assets/home2.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem className={classes.brand}>
              <Paper elevation={3}>
                <h1 className={classes.title}>
                  <span className="d-inline-block">Mail me at</span>
                  {' '}
                  <Link href="mailto:this@parvezmrobin.com">
                    this@parvezmrobin.com
                  </Link>
                </h1>
              </Paper>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
    );
  }
}

export default withStyles(styles)(Contact);

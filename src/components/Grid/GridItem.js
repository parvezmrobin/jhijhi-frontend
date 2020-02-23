import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = {
  grid: {
    position: "relative",
    width: "100%",
    paddingRight: "15px",
    paddingLeft: "15px",
    flexBasis: "auto",
  },
};

const useStyles = makeStyles(styles);

/**
 * @extends {Grid}
 * @constructor
 */
export default function GridItem(props) {
  const classes = useStyles();
  const { children, className, ...rest } = props;
  return (
    <Grid item {...rest} className={classes.grid + " " + className}>
      {children}
    </Grid>
  );
}

GridItem.defaultProps = {
  className: "",
  item: true,
};

GridItem.propTypes = {
  ...Grid.propTypes,
  children: PropTypes.node,
  className: PropTypes.string,
};

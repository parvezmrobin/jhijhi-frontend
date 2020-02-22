/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import PropTypes from 'prop-types';
import BaseList from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomInput from "../CustomInput/CustomInput";
import { Search } from "@material-ui/icons";
import { Card } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import deepPurple from "@material-ui/core/colors/purple";
import { cardTitle } from "assets/jss/material-kit-react.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  cardTitle: { ...cardTitle, textAlign: 'center', color: deepPurple[800] } });

function List(props) {
  const classes = useStyles();

  const itemClass = (props.itemClass || '');
  const mapper = props.itemMapper
    || (item => <ListItem button key={item._id} className={itemClass}>{item}</ListItem>);
  const items = props.list.map(mapper);
  return (
    <Card style={{ backgroundColor: deepPurple[200] }} square elevation={3}>
      <CardContent>
        <h2 className={classes.cardTitle}>{props.title}</h2>
        {props.onFilter && <CustomInput
          labelText="Type here to filter list"
          id="player-search"
          formControlProps={{
            fullWidth: true,
            autoFocus: true,
            onChange: e => props.onFilter(e.target.value),
          }}
          labelProps={{
            style: {color: deepPurple[800]},
          }}
          inputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search/>
              </InputAdornment>
            ),
          }}
        />}
        <BaseList>
          {items}
        </BaseList>
      </CardContent>
    </Card>
  );
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  itemClass: PropTypes.string,
  itemMapper: PropTypes.func,
  list: PropTypes.array.isRequired,
  onFilter: PropTypes.func,
};


export default List;

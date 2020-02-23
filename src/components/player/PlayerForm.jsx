/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { Link } from 'react-router-dom';
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CustomInput from "../CustomInput/CustomInput";
import Button from "../CustomButtons/Button";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

function PlayerForm(props) {
  const isEdit = !!props.values._id;
  const operation = isEdit ? 'Edit' : 'Create';
  const onSubmit = e => {
    e.preventDefault();
    props.onSubmit(e);
  };

  return (
    <Card>
      <CardContent>
        <Typography color="textPrimary" variant="h4">{operation} Player</Typography>
        <form onSubmit={onSubmit}>
          <GridContainer>
            <GridItem xs={12}>
              <CustomInput
                labelText="Player Name"
                id="player-name"
                error={props.isValid.name === false}
                success={props.isValid.name === true}
                formControlProps={{
                  fullWidth: true,
                  onChange: e => props.onChange({ name: e.target.value }),
                }}
                inputProps={{
                  autoFocus: true,
                  value: props.values.name,
                }}
                feedback={props.feedback.name}
              />
            </GridItem>
            <GridItem xs={12}>
              <CustomInput
                labelText="Jersey No"
                id="jersey-no"
                error={props.isValid.jerseyNo === false}
                success={props.isValid.jerseyNo === true}
                formControlProps={{
                  fullWidth: true,
                  onChange: e => props.onChange({ jerseyNo: e.target.value }),
                }}
                inputProps={{
                  value: props.values.jerseyNo,
                }}
                feedback={props.feedback.jerseyNo}
              />
            </GridItem>
            <GridItem xs={12}>
              <GridContainer justify="space-between" alignItems="center"
                             style={{ marginLeft: 0, marginRight: 0 }}>
                <Button type="submit" variant="outlined" color={isEdit ? 'primary' : 'success'}>
                  {operation}
                </Button>
                {isEdit &&
                <label className=""><Link to="/player">Create</Link> a player instead</label>}
              </GridContainer>
            </GridItem>
          </GridContainer>
        </form>
      </CardContent>
    </Card>
  );
}

export default PlayerForm;

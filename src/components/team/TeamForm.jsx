/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Button from "../CustomButtons/Button";


function TeamForm(props) {
  const onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(e)
  };
  const isEdit = props.values._id;
  const operation = isEdit ? 'Edit' : 'Create';

  return (
    <Card>
      <CardContent>
        <Typography color="textPrimary" variant="h4">{operation} Team</Typography>
        <form onSubmit={onSubmit}>
          <GridContainer>
            <GridItem xs={12}>
              <CustomInput
                labelText="Team Name"
                id="team-name"
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
                labelText="Short Name"
                id="short-name"
                error={props.isValid.shortName === false}
                success={props.isValid.shortName === true}
                formControlProps={{
                  fullWidth: true,
                  onChange: e => props.onChange({ shortName: e.target.value }),
                }}
                inputProps={{
                  value: props.values.shortName,
                }}
                feedback={props.feedback.shortName}
              />
            </GridItem>
            <GridItem xs={12}>
              <GridContainer justify="space-between" alignItems="center"
                             style={{ marginLeft: 0, marginRight: 0 }}>
                <Button type="submit" variant="outlined" color={isEdit ? 'primary' : 'success'}>
                  {operation}
                </Button>
                {isEdit &&
                <label className=""><Link to="/team">Create</Link> a team instead</label>}
              </GridContainer>
            </GridItem>
          </GridContainer>
        </form>
      </CardContent>
    </Card>
  );
}

export default TeamForm;

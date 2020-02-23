/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import { bindMethods } from '../lib/utils';
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import Paper from "@material-ui/core/Paper";
import Parallax from "../components/Parallax/Parallax";
import { withStyles } from "@material-ui/core";
import styles from "../assets/jss/material-kit-react/views/componentsSections/navbarsStyle";
import CustomDropdown from "../components/CustomDropdown/CustomDropdown";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      isDropdownOpen: false,
    };
    bindMethods(this);
  }

  handlers = {
    toggle() {
      this.setState(prevState => ({
        isDropdownOpen: !prevState.isDropdownOpen,
      }));
    },
  };

  componentDidMount() {
    document.getElementsByTagName('body')[0].classList.add('home');

    return fetcher
      .get('matches')
      .then(response => {
        return this.setState({ matches: response.data });
      });
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove('home');
    fetcher.cancelAll();
  }

  render() {
    const { classes } = this.props;
    const options = this.state.matches.map((match) => {
      return <Link key={match._id} href={`#live@${match._id}`}>
        <Typography style={{ color: '#fff' }}>{match.name}</Typography>
      </Link>;
    });

    const content = options.length
      ? (
        <CustomDropdown
          buttonText="Select Match"
          hoverColor="info"
          dropdownColor="primary"
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
            style: {fontSize: '24px'},
          }}
          dropdownList={options}
        />
      ) : (
        <div className="col-auto p-1 fs-2">
          <Link href={'#/match'}>Create A Match</Link>
        </div>
      );

    return (
      <Parallax image={require("assets/home2.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem className={classes.brand}>
              <Paper elevation={3} className={classNames([classes.title, classes.primaryColorBackground])}
                     style={{ textAlign: 'center' }}>
                {content}
              </Paper>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
    );
  }

}

export default withStyles(styles)(Home);

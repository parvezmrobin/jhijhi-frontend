/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React from 'react';
import { logout } from '../lib/utils';
import Header from "./Header/Header";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "./CustomButtons/Button";
import CustomDropdown from "./CustomDropdown/CustomDropdown";
import GridItem from "./Grid/GridItem";
import styles from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "./Grid/GridContainer";
import Parallax from "./Parallax/Parallax";
import {
  AccountCircleOutlined,
  ContactMail,
  ExitToApp,
  Games,
  Group,
  Home,
  KeyboardHide,
  Person,
  PersonAdd,
  Score,
  SupervisedUserCircle,
  VerifiedUser,
  VerifiedUserOutlined,
} from "@material-ui/icons";

const useStyles = makeStyles(styles);

const Navbar = (props) => {
  const classes = useStyles();

  let rightLinks, leftLinks;
  if (props.isLoggedIn) {
    leftLinks = <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button href="#/" color="transparent" className={classes.navLink}>
          <Home className={classes.icons}/> Home
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/contact" color="transparent" className={classes.navLink}>
          <ContactMail className={classes.icons}/> Contact
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/" color="transparent" className={classes.navLink}>
          <Person className={classes.icons}/> Player
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/contact" color="transparent" className={classes.navLink}>
          <Group className={classes.icons}/> Team
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/contact" color="transparent" className={classes.navLink}>
          <SupervisedUserCircle className={classes.icons}/> Umpire
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/contact" color="transparent" className={classes.navLink}>
          <Games className={classes.icons}/> Match
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/contact" color="transparent" className={classes.navLink}>
          <Score className={classes.icons}/> Score
        </Button>
      </ListItem>
    </List>;

    rightLinks = <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText={props.username}
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={VerifiedUser}
          dropdownList={[
            <Button href="#/password" color="transparent" className={classes.dropdownLink}>
              <KeyboardHide className={classes.icons}/> Change Password
            </Button>,
            <Button href="#/kidding" color="transparent" className={classes.dropdownLink}
                    style={{ textAlign: 'left' }}>
              <AccountCircleOutlined className={classes.icons}/> Manage Account
            </Button>,
            <Button href="#" color="transparent" className={classes.dropdownLink}
                    style={{ textAlign: 'left' }}
                    onClick={logout}>
              <ExitToApp className={classes.icons}/> Logout
            </Button>,
          ]}
        />
      </ListItem>
    </List>;
  } else {
    rightLinks = <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button href="#/register" color="transparent" className={classes.navLink}>
          <PersonAdd className={classes.icons}/> Register
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="#/login" color="transparent" className={classes.navLink}>
          <VerifiedUserOutlined className={classes.icons}/> Login
        </Button>
      </ListItem>
    </List>;
  }

  return (
    <GridContainer>
      <GridItem>
        <Header
          brand="Jhijhi"
          leftLinks={leftLinks}
          rightLinks={rightLinks}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 400,
            color: "primary",
          }}
        />
        <Parallax image={require("assets/img/bg4.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem>
                <div className={classes.brand}>
                  <h1 className={classes.title}>Material Kit React.</h1>
                  <h3 className={classes.subtitle}>
                    A Badass Material-UI Kit based on Material Design.
                  </h3>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
      </GridItem>
    </GridContainer>
  );
};

export default Navbar;

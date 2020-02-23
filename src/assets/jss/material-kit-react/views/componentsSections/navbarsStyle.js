import { container, title, infoColor, backgroundColors } from "assets/jss/material-kit-react.js";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import color from 'color';

const navbarStyle = theme => ({
  section: {
    padding: "70px 0",
    paddingTop: "0",
  },
  container,
  title: {
    ...title,
    color: 'whitesmoke',
    marginTop: "30px",
    minHeight: "32px",
    textAlign: 'center',
    textDecoration: "none",
    "& > a": {
      color: infoColor,
    },
    "& > a:hover": {
      color: color(infoColor).darken(.15).hex(),
    },
  },
  navbar: {
    marginBottom: "-20px",
    zIndex: "100",
    position: "relative",
    overflow: "hidden",
    "& header": {
      borderRadius: "0",
    },
  },
  navigation: {
    backgroundPosition: "center center",
    backgroundSize: "cover",
    marginTop: "0",
    minHeight: "740px",
  },
  formControl: {
    margin: "0 !important",
    paddingTop: "0",
  },
  inputRootCustomClasses: {
    margin: "0!important",
  },
  searchIcon: {
    width: "20px",
    height: "20px",
    color: "inherit",
  },
  ...headerLinksStyle(theme),
  img: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  imageDropdownButton: {
    padding: "0px",
    top: "4px",
    borderRadius: "50%",
    marginLeft: "5px",
  },
  ...backgroundColors,
});

export default navbarStyle;

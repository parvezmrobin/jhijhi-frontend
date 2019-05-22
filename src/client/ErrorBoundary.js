/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


import React, {Component} from "react";
import CenterContent from "./components/layouts/CenterContent";
import { Link } from 'react-router-dom';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, info) {
    // log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <CenterContent><h1 className="text-center font-weight-normal">
        <span className="d-inline-flex text-danger">Something went wrong!</span>
        <br/>
        <span className="d-inline-flex mt-4">
          Please<Link to="#" onClick={window.location.reload}>&nbsp;reload&nbsp;</Link>the page to retry.
        </span>
      </h1></CenterContent>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

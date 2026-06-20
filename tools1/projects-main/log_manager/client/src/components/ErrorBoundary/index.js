import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../Layout";

class ErrorFallbackBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.state;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.stateHandler({ error: null, errorInfo: null });
    }
  }

  render() {
    return (
      <div className="p-3">
        <h5>Something went wrong.</h5>
        <details style={{ whiteSpace: "pre-wrap" }}>
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo?.componentStack}
        </details>
        <Link to="/home">Home page</Link>
      </div>
    );
  }
}

const ErrorFallback = withRouter(ErrorFallbackBase);

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
    this.stateHandler = this.stateHandler.bind(this);
  }

  stateHandler(state) {
    this.setState(state);
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <ErrorFallback state={this.state} stateHandler={this.stateHandler} />
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;

const ContextDemo = React.lazy(() => import('./ContextDemo'));

function lazy(fn) {
  return class extends React.Component {
    componentDidMount() {
      state = {
        Component: null,
      };
      fn.then((result) => {
        this.setState({
          Component: result,
        });
      });
    }
    render() {
      const { Component } = this.state;
      return Component ? <Component /> : null;
    }
  };
}

import * as React from 'react';
import {Transition} from 'react-transition-group';

class FadeTransition extends React.Component {
  defaultStyles = {
    opacity: 0,
    // eslint-disable-next-line react/destructuring-assignment
    transition: `opacity ${this.props.duration}ms ease-in-out`
  };

  transitionStyles = {
    entering: {opacity: 1},
    entered: {opacity: 1}
  };

  render() {
    const {
      in: inProp, duration, children, ...rest
    } = this.props;

    return (
      <Transition {...rest} in={inProp} timeout={duration}>
        {state => <div style={{...this.defaultStyles, ...this.transitionStyles[state]}}>{children}</div>}
      </Transition>
    );
  }
}

export default FadeTransition;

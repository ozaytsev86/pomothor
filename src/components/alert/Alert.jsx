import './alert.css';
import * as React from 'react';
import {Alert} from 'evergreen-ui';
import {UNIT_2} from '../../constants/StyleVariables';

export const CustomAlert = ({
                              id,
                              type,
                              message,
                              msec,
                              onRemoveAlert
                            }) => {
  const timebarRef = React.useRef();

  React.useEffect(() => {
    if (msec) {
      timebarRef.current.addEventListener('animationend', function onAnimationEnd() {
        timebarRef.current.removeEventListener('animationend', onAnimationEnd);
        onRemoveAlert(id);
      });
    }
  }, []);

  const handleAlertDismiss = () => {
    onRemoveAlert(id);
  };

  return (
    <div id={id} onClick={handleAlertDismiss}>
      <Alert
        className="u-cursor-pointer"
        intent={type}
        title={message}
        marginBottom={UNIT_2}
        onClick={handleAlertDismiss}
      />
      {msec > 0 && (
        <div
          ref={timebarRef}
          className="c-alert-timebar"
          style={{animationDuration: `${msec / 1000}s`}}
        />
      )}
    </div>
  );
};

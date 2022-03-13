import {TransitionGroup} from 'react-transition-group';

import {CustomAlert} from './Alert';
import FadeTransition from './FadeTransition';

export const Alerter = ({
                          alerts,
                          onRemoveAlert
                        }) => {
  const AlerterItems = Object.keys(alerts).map(key => {
    return (
      <FadeTransition key={key}>
        <CustomAlert {...alerts[key]} onRemoveAlert={onRemoveAlert}/>
      </FadeTransition>
    );
  });

  return (
    <div className="c-alerter">
      <TransitionGroup
        className="
          u-display--flex
          u-flex-direction--col
          u-align-items--flex-end
        "
      >
        {AlerterItems}
      </TransitionGroup>
    </div>
  );
};

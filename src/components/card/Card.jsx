import {BORDER_RADIUS_M, UNIT_2} from '../../constants/StyleVariables';
import {Pane} from 'evergreen-ui';
import './card.css';

export const Card = ({children, hoverable}) => {
  const getClasses = () => {
    let classes = 'u-box-shadow-1';

    if (hoverable) {
      classes += ' c-card-hoverable';
    }

    return classes;
  };

  return (
    <Pane
      borderRadius={BORDER_RADIUS_M}
      marginBottom={UNIT_2}
      padding={UNIT_2}
      className={getClasses()}
    >
      {children}
    </Pane>
  );
};
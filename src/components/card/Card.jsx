import {BORDER_RADIUS_M, UNIT_2} from '../../constants/StyleVariables';
import {Pane} from 'evergreen-ui';
import './card.css';

export const Card = ({children, hoverable, active = true, ...rest}) => {
  const getClasses = () => {
    let classes = active ? 'u-box-shadow-1' : '';

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
      background={active ? 'white' : 'gray90'}
      {...rest}
    >
      {children}
    </Pane>
  );
};
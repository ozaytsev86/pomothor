import {Badge as EUIBadge, CrossIcon, IconButton} from 'evergreen-ui';
import {UNIT_1} from '../constants/StyleVariables';

export const Badge = ({id, children, color = 'neutral', onClickRemove = null, ...rest}) => {
  const handleOnClickRemove = () => {
    if (onClickRemove) {
      onClickRemove(id);
    }
  };

  return (
    <EUIBadge
      display="flex"
      alignItems="center"
      minHeight={24}
      color={color}
      width="fit-content"
      {...rest}
      onClick={handleOnClickRemove}
    >
      {children}
      {onClickRemove && (
        <IconButton height={16} icon={CrossIcon} appearance="minimal" marginLeft={UNIT_1}/>
      )}
    </EUIBadge>
  );
};
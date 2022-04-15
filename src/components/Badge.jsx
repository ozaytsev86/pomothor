import {Badge as EUIBadge, Button, CrossIcon, IconButton, Pane, Position, Tooltip} from 'evergreen-ui';
import {UNIT_1} from '../constants/StyleVariables';
import {useState} from 'react';

export const Badge = ({children, color = 'neutral', onClickRemove = null, ...rest}) => {
  const [isVisibleConfirmation, setIsVisibleConfirmation] = useState(false);

  const handleOnClickRemove = () => {
    if (onClickRemove) {
      onClickRemove();
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
    >
      {children}
      {!isVisibleConfirmation && onClickRemove && (
        <IconButton
          height={16}
          icon={CrossIcon}
          appearance="minimal"
          marginLeft={UNIT_1}
          onClick={() => setIsVisibleConfirmation(true)}
        />
      )}
      {isVisibleConfirmation && (
        <Tooltip isShown content="Are you sure?" position={Position.TOP}>
          <Pane>
            <Button
              height={16}
              paddingX={0}
              intent="danger"
              marginLeft={UNIT_1}
              onClick={handleOnClickRemove}
            >YES</Button>
            <Button
              height={16}
              paddingX={0}
              marginLeft={UNIT_1}
              onClick={() => setIsVisibleConfirmation(false)}
            >NO</Button>
          </Pane>
        </Tooltip>
      )}
    </EUIBadge>
  );
};
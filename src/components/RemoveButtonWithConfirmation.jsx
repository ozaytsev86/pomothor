import {Button, IconButton, Pane, Position, Tooltip} from 'evergreen-ui';
import {UNIT_1, UNIT_3} from '../constants/StyleVariables';
import {BiX} from 'react-icons/bi';
import React, {useState} from 'react';
import {useOnClickOutside} from '../hooks/UseOnClickOutside';

export const RemoveButtonWithConfirmation = ({onClickYes}) => {
  const buttonRef = React.useRef();
  const [isVisibleConfirmation, setIsVisibleConfirmation] = useState(false);
  useOnClickOutside(buttonRef, () => setIsVisibleConfirmation(false));

  return (
    <Pane display="inline-block" ref={buttonRef}>
      {!isVisibleConfirmation && (
        <Tooltip content="Remove" position={Position.TOP}>
          <IconButton
            iconSize={UNIT_3}
            appearance="minimal"
            intent="danger"
            icon={BiX}
            onClick={() => setIsVisibleConfirmation(true)}
          />
        </Tooltip>
      )}
      {isVisibleConfirmation && (
        <Tooltip isShown content="Are you sure?" position={Position.TOP}>
          <Pane>
            <Button
              paddingX={0}
              intent="danger"
              marginLeft={UNIT_1}
              onClick={onClickYes}
            >YES</Button>
            <Button
              paddingX={0}
              marginLeft={UNIT_1}
              onClick={() => setIsVisibleConfirmation(false)}
            >NO</Button>
          </Pane>
        </Tooltip>
      )}
    </Pane>
  );
};
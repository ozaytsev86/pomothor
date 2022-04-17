import {Alert, Checkbox, Dialog, Pane, Position, TextInputField, Tooltip} from 'evergreen-ui';
import {UNIT_2} from '../../constants/StyleVariables';
import {BiInfoCircle} from 'react-icons/bi';
import React from 'react';
import {useAppStore} from '../../hooks/UseAppStore';
import {useUpdateTeam} from '../../services/Teams.query';

export const EditTeamModal = ({visible, team, onClose}) => {
  const {userInfo} = useAppStore();
  const [form, setForm] = React.useState({name: team.name, isPrivate: team.isPrivate});
  const [validationError, setValidationError] = React.useState(null);

  const handleOnClose = () => {
    setForm({name: '', isPrivate: true});
    setValidationError(null);
    onClose();
  };

  const {
    isLoading,
    mutateAsync: updateTeam,
    error
  } = useUpdateTeam({
    onSuccess: handleOnClose
  });

  const handleOnClickSave = () => {
    let valid = true;

    if (form.name === '') {
      valid = false;
      setValidationError('This field is required');
    } else if (form.name.length < 3) {
      valid = false;
      setValidationError('This field must have at least 3 characters');
    } else if (form.name.length > 50) {
      valid = false;
      setValidationError('This field has exceeded 50 characters');
    }

    if (valid) {
      setValidationError(null);
      updateTeam({...form, creatorId: userInfo.id, teamId: team.id});
    }
  };

  return (
    <Dialog
      isShown={visible}
      title="Edit Team"
      confirmLabel="Save"
      isConfirmLoading={isLoading}
      onCloseComplete={handleOnClose}
      onConfirm={handleOnClickSave}
    >
      <TextInputField
        required
        autoFocus
        isInvalid={Boolean(validationError)}
        type="text"
        marginBottom={0}
        label="Team Name"
        description="Min length 3, max 50, only space and alphanumeric characters are allowed"
        value={form.name}
        validationMessage={validationError}
        onChange={e => setForm({...form, name: e.target.value})}
      />
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        marginBottom={UNIT_2}
      >
        <Checkbox
          label="Private"
          marginRight={UNIT_2}
          checked={form.isPrivate}
          onChange={e => setForm({...form, isPrivate: e.target.checked})}
        />
        <Tooltip
          content="Private teams won't appear in the list of teams to be accessible by everyone, the creator will have to invite people."
          position={Position.TOP}
        >
          <span><BiInfoCircle/></span>
        </Tooltip>
      </Pane>
      {error && <Alert intent="danger">{error}</Alert>}
    </Dialog>
  );
};
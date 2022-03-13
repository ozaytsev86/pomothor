import {Button, Checkbox, Heading, Pane, Position, TextInputField, Tooltip} from 'evergreen-ui';
import {BORDER_RADIUS_XL, UNIT_2, UNIT_4} from '../../configs/StyleVariables';
import React from 'react';
import {BiInfoCircle} from 'react-icons/bi';

export const TeamsNew = () => {
  const [form, setForm] = React.useState({name: '', isPrivate: true});
  const [error, setError] = React.useState(null);

  const handleOnClickCreateTeam = () => {
    let valid = true;

    if (form.name === '') {
      valid = false;
      setError('This field is required');
    } else if (form.name.length < 3) {
      valid = false;
      setError('This field must have at least 3 characters');
    } else if (form.name.length > 50) {
      valid = false;
      setError('This field has exceeded 50 characters');
    }

    if (valid) {
      setError(null);
      console.log(form);
    }
  };

  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className="u-height-full-content e-bg e-bg-image-new-team"
    >
      <Heading size={900} paddingBottom={UNIT_4}>Create your team and improve its performance</Heading>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        borderRadius={BORDER_RADIUS_XL}
        background="white"
        padding={UNIT_4}
        className="u-box-shadow-1"
      >
        <TextInputField
          required
          autoFocus
          isInvalid={error}
          type="text"
          marginBottom={0}
          label="Team Name"
          description="Min length 3, max 50, only space and alphanumeric characters are allowed"
          width={300}
          value={form.name}
          validationMessage={error}
          onChange={e => setForm({...form, name: e.target.value})}
        />
        <Pane
          display="flex"
          alignItems="center"
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
        <Button appearance="primary" type="submit" onClick={handleOnClickCreateTeam}>
          Let's Go!
        </Button>
      </Pane>
      <Heading size={100} position="absolute" bottom={0}>
        Photo by <a href="https://www.pexels.com/@fauxels" target="_blank" rel="noopener noreferrer">fauxels</a>
      </Heading>
    </Pane>
  );
};
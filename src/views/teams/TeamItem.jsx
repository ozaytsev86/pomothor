import React, {useState} from 'react';
import {withRouter} from 'react-router';
import {Button, Card, CardHeader} from '@material-ui/core';
import {People} from '@material-ui/icons';

import {routes} from '../../constants/routes';
import {locale} from '../../locale/en-us';

const TeamItem = (props) => {
  const [isVisibleJoinButton, setIsVisibleJoinButton] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsVisibleJoinButton(true)}
      onMouseLeave={() => setIsVisibleJoinButton(false)}
    >
      <CardHeader
        title={props.name}
        subheader={`${locale.Users}: ${props.users}`}
        action={
          isVisibleJoinButton && <Button
            disableElevation
            variant="contained"
            color="primary"
            startIcon={<People />}
            onClick={() => props.history.push(`${routes.Teams}/${props.name}`)}
          >
            {locale.Join}
          </Button>
        }
      />
    </Card>
  )
}

export default withRouter(TeamItem);
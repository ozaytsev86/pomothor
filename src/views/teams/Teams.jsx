import {Pane} from 'evergreen-ui';
import {useFetchTeams} from '../../services/Teams.query';
import {useAppStore} from '../../hooks/UseAppStore';

export const Teams = () => {
  const {userInfo} = useAppStore();

  const {
    isLoading,
    data: teams = [],
    error
  } = useFetchTeams();

  console.log(teams)
  console.log(userInfo)

  return (
    <Pane>
      teams
    </Pane>
  )
}
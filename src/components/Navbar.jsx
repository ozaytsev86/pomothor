import {supabase} from '../services/Api';
import {Avatar, Button, Heading, Menu, Pane, Popover, Position} from 'evergreen-ui';
import {BiCog, BiGroup, BiHome, BiLogOut, BiPlus} from 'react-icons/bi';
import Logo from '../statics/images/logo.png';
import {NavLink, useNavigate} from 'react-router-dom';
import {HOME, SETTINGS, TEAMS, TEAMS_MY, TEAMS_NEW} from '../constants/Routes';
import {UNIT_2, UNIT_3, UNIT_4} from '../constants/StyleVariables';
import {useAppStore} from '../hooks/UseAppStore';

export const Navbar = () => {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    supabase.auth.signOut().catch(console.error);
  };

  if (!userInfo) {
    return null;
  }

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={UNIT_2}
      background="white"
      className="u-box-shadow-1"
    >
      <NavLink to="/" className="u-display-flex u-align-items-center u-text-decoration-none">
        <Avatar src={Logo} size={UNIT_4} className="u-mr-2"/>
        <Heading size={500}>Pomothor</Heading>
      </NavLink>
      <Pane
        display="flex"
        alignItems="center"
      >
        <Pane marginRight={UNIT_2}>
          <Button appearance="minimal" onClick={() => navigate(HOME)}>
            <BiHome fontSize={UNIT_3} className="u-mr-1"/>Home
          </Button>
          <Button appearance="minimal" onClick={() => navigate(TEAMS_NEW)}>
            <BiPlus fontSize={UNIT_3} className="u-mr-1"/>Create a Team
          </Button>
          <Button appearance="minimal" onClick={() => navigate(TEAMS)}>
            <BiGroup fontSize={UNIT_3} className="u-mr-1"/>Teams
          </Button>
        </Pane>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item onClick={() => navigate(SETTINGS)}>
                  <Pane display="flex" alignItems="center">
                    <BiCog className="u-mr-1"/>Settings
                  </Pane>
                </Menu.Item>
                <Menu.Item onClick={() => navigate(TEAMS_MY)}>
                  <Pane display="flex" alignItems="center">
                    <BiGroup className="u-mr-1"/>My Teams
                  </Pane>
                </Menu.Item>
                <Menu.Item onClick={handleLogout}>
                  <Pane display="flex" alignItems="center">
                    <BiLogOut className="u-mr-1"/>Logout
                  </Pane>
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <Avatar size={UNIT_4} src={userInfo.user_metadata.avatar_url} className="u-cursor-pointer"/>
        </Popover>
      </Pane>
    </Pane>
  );
};

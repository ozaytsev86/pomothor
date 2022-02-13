import {supabase} from '../services/api';
import {Avatar, Menu, Popover, Position} from 'evergreen-ui';

export const Navbar = ({user}) => {
  const handleLogout = async () => {
    supabase.auth.signOut().catch(console.error);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="u-display-flex u-align-items-center u-justify-content u-p-2 u-box-shadow-1">
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item onSelect={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <Avatar size={36} src={user.user_metadata.avatar_url} className="u-cursor-pointer"/>
      </Popover>
    </div>
  );
};

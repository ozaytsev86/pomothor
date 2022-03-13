import {Heading, Pane} from 'evergreen-ui';

export const Home = ({user}) => {
  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="u-height-full-content e-bg e-bg-image-home"
    >
      <Heading size={900}>
        Welcome {user.user_metadata.name}
      </Heading>
      <Heading size={100} position="absolute" bottom={0}>
        Photo by <a href="https://www.pexels.com/@ketut-subiyanto" target="_blank" rel="noopener noreferrer">Ketut Subiyanto</a>
      </Heading>
    </Pane>
  );
};

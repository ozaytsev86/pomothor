export const Home = ({user}) => {
  return (
    <h1 className={'w-screen fixed flex flex-col min-h-screen bg-gray-50'}>
      Welcome {user.user_metadata.name}
    </h1>
  );
};

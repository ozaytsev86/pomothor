const formatTeamNameToId = (name) => name.trim().replace(/\s+/g, '-').toLowerCase();
const isValidTeamName = (value) => /^[a-zA-Z0-9]*$/.test(value);
const isValidTeamUrl = (value) => /^[a-zA-Z0-9]([-a-zA-Z0-9])*$/.test(value); //improve this regex to not allow more than one continued dash

const isDuplicatedTeamName = (name, teams) => {
  let isDuplicated = false;
  const formattedName = formatTeamNameToId(name);
  teams && Object.keys(teams).forEach(teamKey => {
    if (teamKey === formattedName) isDuplicated = true;
  });
  return isDuplicated;
};

export {formatTeamNameToId, isValidTeamName, isValidTeamUrl, isDuplicatedTeamName};

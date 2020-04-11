const formatTeamName = (name) => name.trim().replace(/\s+/g, '-').toLowerCase();
const isValidTeamName = (value) => /^[a-zA-Z0-9 ]*$/.test(value);
const isValidTeamUrl = (value) => /^[a-zA-Z0-9-]*$/.test(value);

const isDuplicatedTeamName = (name, teams = {}) => {
  let isDuplicated = false;
  const formattedName = formatTeamName(name);
  {Object.keys(teams).map(teamKey => {
    if (teamKey === formattedName) isDuplicated = true;
  })}
  return isDuplicated;
};

export {formatTeamName, isValidTeamName, isValidTeamUrl, isDuplicatedTeamName};

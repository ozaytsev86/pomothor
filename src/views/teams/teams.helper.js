const formatTeamName = (name) => name.trim().replace(/\s+/g, '-').toLowerCase();

const isValidTeamName = (value) => {
  return /^[a-zA-Z0-9 ]*$/.test(value);
};

const isValidTeamUrl = (value) => {
  return /^[a-zA-Z0-9-]*$/.test(value);
};

const isDuplicatedTeamName = (name, teamsList) => {
  let isDuplicated = false;
  const formattedName = formatTeamName(name);
  {Object.keys(teamsList).map(teamKey => {
    if (teamKey === formattedName) isDuplicated = true;
  })}
  return isDuplicated;
};

export {formatTeamName, isValidTeamName, isValidTeamUrl, isDuplicatedTeamName};

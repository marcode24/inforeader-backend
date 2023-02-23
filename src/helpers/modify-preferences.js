const modifiyPreference = async (option, user, resourceID) => {
  try {
    option = option === 'subscription' ? `${option}s` : `${option}Feeds`;
    const resourcesFromDB = user[option];
    const existResource = resourcesFromDB.find((el) => el._id.equals(resourceID));
    if (existResource) {
      user[option] = resourcesFromDB
        .filter((resource) => !resource._id.equals(resourceID));
    } else {
      user[option].push(resourceID);
    }
    await user.save();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  modifiyPreference,
};

const modifiyPreference = async (option, user, resourceID) => {
  try {
    option = option === "subscription" ? `${option}s` : `${option}Feeds`;
    const resourcesFromDB = user[option];
    const existResource = resourcesFromDB.find((el) => el._id == resourceID);
    if (existResource) {
      // delete resource from array
      user[option] = resourcesFromDB.filter(
        (resource) => resource._id != resourceID
      );
    } else {
      // add resource to array
      user[option].push(resourceID);
    }
    await user.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  modifiyPreference,
};

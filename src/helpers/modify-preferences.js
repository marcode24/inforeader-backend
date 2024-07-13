const modifiyPreference = async ({ option, user, resource }) => {
  try {
    option = option === 'subscription' ? `${option}s` : `${option}Feeds`;
    const resourcesFromDB = user[option];
    const { _id: resourceID } = resource;
    const existResource = resourcesFromDB.some((el) => el.equals(resourceID));

    if (option === 'likedFeeds') {
      resource.likes += existResource ? -1 : 1;
      await resource.save();
    }

    // update the user preferences
    if (existResource) {
      user[option] = resourcesFromDB.filter((item) => !item.equals(resourceID));
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

// utils/profileCompletion.js

export const isProfileComplete = (user) => {

  const requiredFields = [

    user.firstName,
    user.lastName,
    user.phone,

    user.roleId,
    user.regionId,

    user.nationalId,

  ];

  const basicComplete =
    requiredFields.every(Boolean);

  const hasNextOfKin =
    !!user.nextOfKin;

  return (
    basicComplete &&
    hasNextOfKin
  );

};
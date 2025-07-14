const messages = {
  common: {
    error: "An error occurred. Please try again later",
    success: "Success",
  },
  registration: {
    userNameExists: "User name already exists",
    userNamePasswordRequired: "Username and password are required",
    registrationSuccess: "User registered successfully",
    registrationIsNotAllowed: "Registration is not allowed",
  },
  login: {
    userNotFound: "User not found",
    multipleUsersFound: "Multiple users found with the same username",
    passwordMismatch: "Username and Password does not match",
    authenticated: "Authenticated successfully",
  },
  auth: {
    refreshTokenNotFound: "Refresh token is not found",
  },
  election: {
    missingFields: "The following fields are missing :",
    createSuccess: "Election created successfully",
    startDateEndDateMismatch:
      "Start date and time must be before end date and time.",
  },
  voter: {
    registrationIsNotAllowed:
      "Voter registration and key generation is not allowed",
    registrationSuccess: "Voter registration successful",
    votersSecretKeyMissing: "Voters secret key is missing",
    pollingStationSecretKeyMissing: "Polling station secret key is missing",
    invalidKeys: "Invalid voters or polling station secret keys",
  },
};

export default messages;

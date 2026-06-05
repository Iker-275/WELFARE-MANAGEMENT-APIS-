// services/profileCompletionService.js

import { UserRepository }from "../repository/userRepo.js";

import { isProfileComplete }from "../utils/profileCompletion.js";

const repo =new UserRepository();

export class ProfileCompletionService {

  async evaluate(userId) {

    const user =
      await repo.findForCompletionCheck(
        userId
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const completed =isProfileComplete(user);

    await repo.update(userId, {

      signupCompleted:
        completed,

    });

    return completed;

  }

}
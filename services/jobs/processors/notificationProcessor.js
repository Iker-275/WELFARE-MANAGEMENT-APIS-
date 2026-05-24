import {
  NotificationRepository
} from "../../../repository/notifRepo.js";

const repo =new NotificationRepository();
//  export const notificationProcessor =
//   async job => {

//     const {
//       notificationId,
//       roleIds,
//       regionIds,
//       sendToAll,
//     } = job.data;

//     // GET TARGET USERS

//     const users =
//       await repo.getTargetUsers({

//         roleIds,
//         regionIds,
//         sendToAll,

//       });

//     // CREATE RECIPIENTS

//     await repo.createRecipients(
//       notificationId,
//       users.map(user => user.id)
//     );

//   };


  export const notificationProcessor =
  async job => {

    const {
      notificationId,
      roleIds,
      regionIds,
      sendToAll,
    } = job.data;

    // GET TARGET USERS

    const users =
      await repo.getTargetUsers({

        roleIds,
        regionIds,
        sendToAll,

      });

    // CREATE RECIPIENTS

    await repo.createRecipients(

      notificationId,

      users.map(user => user.id)

    );

    console.log(
      `Notification processed: ${notificationId}`
    );

  };
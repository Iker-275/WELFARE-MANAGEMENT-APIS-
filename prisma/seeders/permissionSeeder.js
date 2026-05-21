// prisma/seeders/permissionSeeder.js

import { prisma } from "../../index.js";

const permissions = [

  // ======================================================
  // USERS
  // ======================================================

  {
    name: "create_user",
    description: "Create new users"
  },

  {
    name: "view_users",
    description: "View system users"
  },

  {
    name: "update_user",
    description: "Update user details"
  },

  {
    name: "delete_user",
    description: "Delete users"
  },

  {
    name: "activate_user",
    description: "Activate user accounts"
  },

  {
    name: "deactivate_user",
    description: "Deactivate user accounts"
  },

  {
    name: "assign_role",
    description: "Assign roles to users"
  },



  // ======================================================
  // ROLES
  // ======================================================

  {
    name: "create_role",
    description: "Create roles"
  },

  {
    name: "view_roles",
    description: "View roles"
  },

  {
    name: "update_role",
    description: "Update roles"
  },

  {
    name: "delete_role",
    description: "Delete roles"
  },



  // ======================================================
  // PERMISSIONS
  // ======================================================

  {
    name: "create_permission",
    description: "Create permissions"
  },

  {
    name: "view_permissions",
    description: "View permissions"
  },

  {
    name: "assign_permission",
    description: "Assign permissions to roles"
  },

  {
    name: "remove_permission",
    description: "Remove permissions from roles"
  },



  // ======================================================
  // REGIONS
  // ======================================================

  {
    name: "create_region",
    description: "Create regions"
  },

  {
    name: "view_regions",
    description: "View regions"
  },

  {
    name: "update_region",
    description: "Update regions"
  },

  {
    name: "delete_region",
    description: "Delete regions"
  },



  // ======================================================
  // CLAIMS
  // ======================================================

  {
    name: "create_claim",
    description: "Create welfare claims"
  },

  {
    name: "view_claims",
    description: "View welfare claims"
  },

  {
    name: "approve_claim",
    description: "Approve welfare claims"
  },

  {
    name: "reject_claim",
    description: "Reject welfare claims"
  },



  // ======================================================
  // ANNOUNCEMENTS
  // ======================================================

  {
    name: "create_announcement",
    description: "Create announcements"
  },

  {
    name: "view_announcements",
    description: "View announcements"
  },

  {
    name: "update_announcement",
    description: "Update announcements"
  },

  {
    name: "delete_announcement",
    description: "Delete announcements"
  },



  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  {
    name: "send_notification",
    description: "Send notifications"
  },

  {
    name: "view_notifications",
    description: "View notifications"
  },



  // ======================================================
  // FILES
  // ======================================================

  {
    name: "upload_files",
    description: "Upload files"
  },

  {
    name: "delete_files",
    description: "Delete files"
  },



  // ======================================================
  // REPORTS
  // ======================================================

  {
    name: "view_reports",
    description: "View reports"
  },

  {
    name: "export_reports",
    description: "Export reports"
  },



  // ======================================================
  // SYSTEM
  // ======================================================

  {
    name: "manage_system",
    description: "Full system management"
  },

  {
    name: "view_audit_logs",
    description: "View audit logs"
  }

];

export class PermissionSeeder {

  static async seed() {

    console.log("Seeding permissions...");

    for (const permission of permissions) {

      const existing =
        await prisma.permission.findUnique({
          where: {
            name: permission.name
          }
        });

      if (!existing) {

        await prisma.permission.create({
          data: permission
        });

        console.log(
          `Seeded permission: ${permission.name}`
        );

      } else {

        console.log(
          `Permission already exists: ${permission.name}`
        );

      }

    }

    console.log("Permission seeding complete.");

  }

}
---
name: organization-best-practices
description: Configure multi-tenant organizations, manage members and invitations, define custom roles and permissions, set up teams, and implement RBAC using Better Auth's organization plugin. Use when auth need org setup, team management, member roles, access control, or the Better Auth organization plugin.
---

## Setup

1. Add `organization()` plugin to server config
2. Add `organizationClient()` plugin to client config
3. Run `npx @better-server/cli migrate`
4. Verify: check that organization, member, invitation tables exist in your database

```ts
import { betterAuth } from "better-server";
import { organization } from "better-server/plugins";

export const server = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5, // Max orgs per auth
      membershipLimit: 100, // Max members per org
    }),
  ],
});
```

### Client-Side Setup

```ts
import { createAuthClient } from "better-server/client";
import { organizationClient } from "better-server/client/plugins";

export const client = createAuthClient({
  plugins: [organizationClient()],
});
```

## Creating Organizations

The creator is automatically assigned the `owner` role.

```ts
const createOrg = async () => {
  const { data, error } = await client.organization.create({
    name: "My Company",
    slug: "my-company",
    logo: "https://example.com/logo.png",
    metadata: { plan: "pro" },
  });
};
```

### Controlling Organization Creation

Restrict who can create organizations based on auth attributes:

```ts
organization({
  allowUserToCreateOrganization: async (auth) => {
    return auth.emailVerified === true;
  },
  organizationLimit: async (auth) => {
    // Premium auth get more organizations
    return auth.plan === "premium" ? 20 : 3;
  },
});
```

### Creating Organizations on Behalf of Users

Administrators can create organizations for other auth (server-side only):

```ts
await server.api.createOrganization({
  body: {
    name: "Client Organization",
    slug: "client-org",
    userId: "auth-id-who-will-be-owner", // `userId` is required
  },
});
```

**Note**: The `userId` parameter cannot be used alongside session headers.


## Active Organizations

Stored in the session and scopes subsequent API calls. Set after auth selects one.

```ts
const setActive = async (organizationId: string) => {
  const { data, error } = await client.organization.setActive({
    organizationId,
  });
};
```

Many endpoints use the active organization when `organizationId` is not provided (`listMembers`, `listInvitations`, `inviteMember`, etc.).

Use `getFullOrganization()` to retrieve the active org with all members, invitations, and teams.

## Members

### Adding Members (Server-Side)

```ts
await server.api.addMember({
  body: {
    userId: "auth-id",
    role: "member",
    organizationId: "org-id",
  },
});
```

For client-side member additions, use the invitation system instead.

### Assigning Multiple Roles

```ts
await server.api.addMember({
  body: {
    userId: "auth-id",
    role: ["admin", "moderator"],
    organizationId: "org-id",
  },
});
```

### Removing Members

Use `removeMember({ memberIdOrEmail })`. The last owner cannot be removed — assign ownership to another member first.

### Updating Member Roles

Use `updateMemberRole({ memberId, role })`.

### Membership Limits

```ts
organization({
  membershipLimit: async (auth, organization) => {
    if (organization.metadata?.plan === "enterprise") {
      return 1000;
    }
    return 50;
  },
});
```

## Invitations

### Setting Up Invitation Emails

```ts
import { betterAuth } from "better-server";
import { organization } from "better-server/plugins";
import { sendEmail } from "./email";

export const server = betterAuth({
  plugins: [
    organization({
      sendInvitationEmail: async (data) => {
        const { email, organization, inviter, invitation } = data;

        await sendEmail({
          to: email,
          subject: `Join ${organization.name}`,
          html: `
            <p>${inviter.auth.name} invited you to join ${organization.name}</p>
            <a href="https://yourapp.com/accept-invite?id=${invitation.id}">
              Accept Invitation
            </a>
          `,
        });
      },
    }),
  ],
});
```

### Sending Invitations

```ts
await client.organization.inviteMember({
  email: "newuser@example.com",
  role: "member",
});
```

### Shareable Invitation URLs

```ts
const { data } = await client.organization.getInvitationURL({
  email: "newuser@example.com",
  role: "member",
  callbackURL: "https://yourapp.com/dashboard",
});

// Share data.url via any channel
```

This endpoint does not call `sendInvitationEmail` — handle delivery yourself.

### Invitation Configuration

```ts
organization({
  invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days (default: 48 hours)
  invitationLimit: 100, // Max pending invitations per org
  cancelPendingInvitationsOnReInvite: true, // Cancel old invites when re-inviting
});
```

## Roles & Permissions

Default roles: `owner` (full access), `admin` (manage members/invitations/settings), `member` (basic access).

### Checking Permissions

```ts
const { data } = await client.organization.hasPermission({
  permission: "member:write",
});

if (data?.hasPermission) {
  // User can manage members
}
```

Use `checkRolePermission({ role, permissions })` for client-side UI rendering (static only). For dynamic access control, use the `hasPermission` endpoint.

## Teams

### Enabling Teams

```ts
import { organization } from "better-server/plugins";

export const server = betterAuth({
  plugins: [
    organization({
        teams: {
            enabled: true
        }
    }),
  ],
});
```

### Creating Teams

```ts
const { data } = await client.organization.createTeam({
  name: "Engineering",
});
```

### Managing Team Members

Use `addTeamMember({ teamId, userId })` (member must be in org first) and `removeTeamMember({ teamId, userId })` (stays in org).

Set active team with `setActiveTeam({ teamId })`.

### Team Limits

```ts
organization({
  teams: {
      maximumTeams: 20, // Max teams per org
      maximumMembersPerTeam: 50, // Max members per team
      allowRemovingAllTeams: false, // Prevent removing last team
  }
});
```

## Dynamic Access Control

### Enabling Dynamic Access Control

```ts
import { organization } from "better-server/plugins";
import { dynamicAccessControl } from "@better-server/organization/addons";

export const server = betterAuth({
  plugins: [
    organization({
        dynamicAccessControl: {
            enabled: true
        }
    }),
  ],
});
```

### Creating Custom Roles

```ts
await client.organization.createRole({
  role: "moderator",
  permission: {
    member: ["read"],
    invitation: ["read"],
  },
});
```

Use `updateRole({ roleId, permission })` and `deleteRole({ roleId })`. Pre-defined roles (owner, admin, member) cannot be deleted. Roles assigned to members cannot be deleted until reassigned.

## Lifecycle Hooks

Execute custom logic at various points in the organization lifecycle:

```ts
organization({
  hooks: {
    organization: {
      beforeCreate: async ({ data, auth }) => {
        // Validate or modify data before creation
        return {
          data: {
            ...data,
            metadata: { ...data.metadata, createdBy: auth.id },
          },
        };
      },
      afterCreate: async ({ organization, member }) => {
        // Post-creation logic (e.g., send welcome email, create default resources)
        await createDefaultResources(organization.id);
      },
      beforeDelete: async ({ organization }) => {
        // Cleanup before deletion
        await archiveOrganizationData(organization.id);
      },
    },
    member: {
      afterCreate: async ({ member, organization }) => {
        await notifyAdmins(organization.id, `New member joined`);
      },
    },
    invitation: {
      afterCreate: async ({ invitation, organization, inviter }) => {
        await logInvitation(invitation);
      },
    },
  },
});
```

## Schema Customization

Customize table names, field names, and add additional fields:

```ts
organization({
  auth: {
    organization: {
      modelName: "workspace", // Rename table
      fields: {
        name: "workspaceName", // Rename fields
      },
      additionalFields: {
        billingId: {
          type: "string",
          required: false,
        },
      },
    },
    member: {
      additionalFields: {
        department: {
          type: "string",
          required: false,
        },
        title: {
          type: "string",
          required: false,
        },
      },
    },
  },
});
```

## Security Considerations

### Owner Protection

- The last owner cannot be removed from an organization
- The last owner cannot leave the organization
- The owner role cannot be removed from the last owner

Always ensure ownership transfer before removing the current owner:

```ts
// Transfer ownership first
await client.organization.updateMemberRole({
  memberId: "new-owner-member-id",
  role: "owner",
});

// Then the previous owner can be demoted or removed
```

### Organization Deletion

Deleting an organization removes all associated data (members, invitations, teams). Prevent accidental deletion:

```ts
organization({
  disableOrganizationDeletion: true, // Disable via config
});
```

Or implement soft delete via hooks:

```ts
organization({
  hooks: {
    organization: {
      beforeDelete: async ({ organization }) => {
        // Archive instead of delete
        await archiveOrganization(organization.id);
        throw new Error("Organization archived, not deleted");
      },
    },
  },
});
```

### Invitation Security

- Invitations expire after 48 hours by default
- Only the invited email address can accept an invitation
- Pending invitations can be cancelled by organization admins

## Complete Configuration Example

```ts
import { betterAuth } from "better-server";
import { organization } from "better-server/plugins";
import { sendEmail } from "./email";

export const server = betterAuth({
  plugins: [
    organization({
      // Organization limits
      allowUserToCreateOrganization: true,
      organizationLimit: 10,
      membershipLimit: 100,
      creatorRole: "owner",

      // Slugs
      defaultOrganizationIdField: "slug",

      // Invitations
      invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
      invitationLimit: 50,
      sendInvitationEmail: async (data) => {
        await sendEmail({
          to: data.email,
          subject: `Join ${data.organization.name}`,
          html: `<a href="https://app.com/invite/${data.invitation.id}">Accept</a>`,
        });
      },

      // Hooks
      hooks: {
        organization: {
          afterCreate: async ({ organization }) => {
            console.log(`Organization ${organization.name} created`);
          },
        },
      },
    }),
  ],
});
```

import { MyContext } from "../index";
import { requireAuth } from "../utils/graphql-auth";
import TeamMember from "../models/team_member.model";
import TeamMemberSkill from "../models/team_member_skill.model";
import TeamMemberSocialLink from "../models/team_member_social_link.model";
import { TeamMemberStatus } from "../enums";

/** GraphQL enum names vs Sequelize ENUM ("active" / "inactive") */
function gqlTeamStatusToDb(value: unknown): TeamMemberStatus | undefined {
  if (value == null) return undefined;
  if (value === "ACTIVE" || value === TeamMemberStatus.ACTIVE)
    return TeamMemberStatus.ACTIVE;
  if (value === "INACTIVE" || value === TeamMemberStatus.INACTIVE)
    return TeamMemberStatus.INACTIVE;
  return undefined;
}

function dbTeamStatusToGql(status: string): "ACTIVE" | "INACTIVE" {
  if (status === TeamMemberStatus.ACTIVE || status === "active")
    return "ACTIVE";
  if (status === TeamMemberStatus.INACTIVE || status === "inactive")
    return "INACTIVE";
  return "ACTIVE";
}

const teamResolvers = {
  TeamMember: {
    status: (parent: { status: string }) => dbTeamStatusToGql(parent.status),
    /** Contact fields omitted for anonymous API consumers (public site). */
    email: (parent: { email?: string }, _: unknown, context: MyContext) =>
      context.user?.id ? parent.email ?? "" : "",
    phone: (parent: { phone?: string }, _: unknown, context: MyContext) =>
      context.user?.id ? parent.phone : null,
    bio: (parent: { bio?: string }, _: unknown, context: MyContext) =>
      context.user?.id ? parent.bio : null,
  },
  Query: {
    teamMembers: async (_: any, __: any, context: MyContext) => {
      try {
        const teamMembers = await TeamMember.findAll({
          include: [
            { model: TeamMemberSkill, as: "skills" },
            { model: TeamMemberSocialLink, as: "social_links" },
          ],
        });
        return teamMembers;
      } catch (error) {
        throw new Error("Failed to fetch team members");
      }
    },
    teamMember: async (_: any, { id }: { id: string }, context: MyContext) => {
      try {
        const teamMember = await TeamMember.findByPk(id, {
          include: [
            { model: TeamMemberSkill, as: "skills" },
            { model: TeamMemberSocialLink, as: "social_links" },
          ],
        });
        if (!teamMember) {
          throw new Error("Team member not found");
        }
        return teamMember;
      } catch (error) {
        throw new Error("Failed to fetch team member");
      }
    },
  },
  Mutation: {
    createTeamMember: async (
      _: any,
      {
        name,
        role,
        email,
        phone,
        avatar_url,
        bio,
        join_date,
        status: statusArg,
        skills = [],
        social_links = [],
      }: {
        name: string;
        role: string;
        email: string;
        phone?: string;
        avatar_url?: string;
        bio?: string;
        join_date: string;
        status?: unknown;
        skills?: string[];
        social_links?: { platform: string; url: string }[];
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const existingMember = await TeamMember.findOne({ where: { email } });
        if (existingMember) {
          throw new Error("Team member with this email already exists");
        }

        const dbStatus =
          gqlTeamStatusToDb(statusArg) ?? TeamMemberStatus.ACTIVE;

        const teamMember = await TeamMember.create({
          name,
          role,
          email,
          phone,
          avatar_url,
          bio,
          join_date: new Date(join_date),
          status: dbStatus,
        });

        // Add skills
        if (skills.length > 0) {
          await Promise.all(
            skills.map((skill) =>
              TeamMemberSkill.create({
                team_member_id: teamMember.id,
                skill_name: skill,
              }),
            ),
          );
        }

        // Add social links
        if (social_links.length > 0) {
          await Promise.all(
            social_links.map((link) =>
              TeamMemberSocialLink.create({
                team_member_id: teamMember.id,
                platform: link.platform,
                url: link.url,
              }),
            ),
          );
        }

        const createdMember = await TeamMember.findByPk(teamMember.id, {
          include: [
            { model: TeamMemberSkill, as: "skills" },
            { model: TeamMemberSocialLink, as: "social_links" },
          ],
        });

        return {
          success: true,
          message: "Team member created successfully",
          teamMember: createdMember,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to create team member",
        );
      }
    },
    updateTeamMember: async (
      _: any,
      {
        id,
        name,
        role,
        email,
        phone,
        avatar_url,
        bio,
        join_date,
        status: statusArg,
        skills = [],
        social_links = [],
      }: {
        id: string;
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        avatar_url?: string;
        bio?: string;
        join_date?: string;
        status?: unknown;
        skills?: string[];
        social_links?: { platform: string; url: string }[];
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const teamMember = await TeamMember.findByPk(id);
        if (!teamMember) {
          throw new Error("Team member not found");
        }

        const nextStatus =
          statusArg !== undefined && statusArg !== null
            ? gqlTeamStatusToDb(statusArg) ?? teamMember.status
            : teamMember.status;

        await teamMember.update({
          name: name || teamMember.name,
          role: role || teamMember.role,
          email: email || teamMember.email,
          phone: phone !== undefined ? phone : teamMember.phone,
          avatar_url:
            avatar_url !== undefined ? avatar_url : teamMember.avatar_url,
          bio: bio !== undefined ? bio : teamMember.bio,
          join_date: join_date ? new Date(join_date) : teamMember.join_date,
          status: nextStatus,
        });

        // Update skills
        if (skills.length > 0) {
          await TeamMemberSkill.destroy({ where: { team_member_id: id } });
          await Promise.all(
            skills.map((skill) =>
              TeamMemberSkill.create({
                team_member_id: id,
                skill_name: skill,
              }),
            ),
          );
        }

        // Update social links
        if (social_links.length > 0) {
          await TeamMemberSocialLink.destroy({ where: { team_member_id: id } });
          await Promise.all(
            social_links.map((link) =>
              TeamMemberSocialLink.create({
                team_member_id: id,
                platform: link.platform,
                url: link.url,
              }),
            ),
          );
        }

        const updatedMember = await TeamMember.findByPk(id, {
          include: [
            { model: TeamMemberSkill, as: "skills" },
            { model: TeamMemberSocialLink, as: "social_links" },
          ],
        });

        return {
          success: true,
          message: "Team member updated successfully",
          teamMember: updatedMember,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update team member",
        );
      }
    },
    deleteTeamMember: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const teamMember = await TeamMember.findByPk(id);
        if (!teamMember) {
          throw new Error("Team member not found");
        }

        await teamMember.destroy();
        return {
          success: true,
          message: "Team member deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to delete team member",
        );
      }
    },
  },
};

export default teamResolvers;

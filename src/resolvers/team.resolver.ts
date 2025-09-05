import { MyContext } from "../index";
import TeamMember from "../models/team_member.model";
import TeamMemberSkill from "../models/team_member_skill.model";
import TeamMemberSocialLink from "../models/team_member_social_link.model";
import { TeamMemberStatus } from "../enums";

const teamResolvers = {
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
        status = TeamMemberStatus.ACTIVE,
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
        status?: TeamMemberStatus;
        skills?: string[];
        social_links?: { platform: string; url: string }[];
      },
      context: MyContext
    ) => {
      try {
        const existingMember = await TeamMember.findOne({ where: { email } });
        if (existingMember) {
          throw new Error("Team member with this email already exists");
        }

        const teamMember = await TeamMember.create({
          name,
          role,
          email,
          phone,
          avatar_url,
          bio,
          join_date: new Date(join_date),
          status,
        });

        // Add skills
        if (skills.length > 0) {
          await Promise.all(
            skills.map((skill) =>
              TeamMemberSkill.create({
                team_member_id: teamMember.id,
                skill_name: skill,
              })
            )
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
              })
            )
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
            : "Failed to create team member"
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
        status,
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
        status?: TeamMemberStatus;
        skills?: string[];
        social_links?: { platform: string; url: string }[];
      },
      context: MyContext
    ) => {
      try {
        const teamMember = await TeamMember.findByPk(id);
        if (!teamMember) {
          throw new Error("Team member not found");
        }

        await teamMember.update({
          name: name || teamMember.name,
          role: role || teamMember.role,
          email: email || teamMember.email,
          phone: phone !== undefined ? phone : teamMember.phone,
          avatar_url:
            avatar_url !== undefined ? avatar_url : teamMember.avatar_url,
          bio: bio !== undefined ? bio : teamMember.bio,
          join_date: join_date ? new Date(join_date) : teamMember.join_date,
          status: status || teamMember.status,
        });

        // Update skills
        if (skills.length > 0) {
          await TeamMemberSkill.destroy({ where: { team_member_id: id } });
          await Promise.all(
            skills.map((skill) =>
              TeamMemberSkill.create({
                team_member_id: id,
                skill_name: skill,
              })
            )
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
              })
            )
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
            : "Failed to update team member"
        );
      }
    },
    deleteTeamMember: async (
      _: any,
      { id }: { id: string },
      context: MyContext
    ) => {
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
            : "Failed to delete team member"
        );
      }
    },
  },
};

export default teamResolvers;

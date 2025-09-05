import { MyContext } from "../index";
import SystemSettings from "../models/system_settings.model";
import ActivityLog from "../models/activity_log.model";
import { Theme } from "../enums";

const systemResolvers = {
  Query: {
    systemSettings: async (_: any, __: any, context: MyContext) => {
      try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
          // Create default settings if none exist
          settings = await SystemSettings.create({
            business_name: "Zohar Media",
            business_description: "",
            industry: "",
            website_url: "",
            contact_email: "",
            theme: Theme.LIGHT,
          });
        }
        return settings;
      } catch (error) {
        throw new Error("Failed to fetch system settings");
      }
    },
    activityLogs: async (
      _: any,
      {
        user_id,
        entity_type,
        limit = 50,
        offset = 0,
      }: {
        user_id?: string;
        entity_type?: string;
        limit?: number;
        offset?: number;
      },
      context: MyContext
    ) => {
      try {
        const where: any = {};
        if (user_id) where.user_id = user_id;
        if (entity_type) where.entity_type = entity_type;

        const activityLogs = await ActivityLog.findAndCountAll({
          where,
          limit,
          offset,
          order: [["created_at", "DESC"]],
        });

        return {
          items: activityLogs.rows,
          total: activityLogs.count,
        };
      } catch (error) {
        throw new Error("Failed to fetch activity logs");
      }
    },
  },
  Mutation: {
    updateSystemSettings: async (
      _: any,
      {
        business_name,
        business_description,
        industry,
        website_url,
        contact_email,
        theme,
      }: {
        business_name?: string;
        business_description?: string;
        industry?: string;
        website_url?: string;
        contact_email?: string;
        theme?: Theme;
      },
      context: MyContext
    ) => {
      try {
        const [settings, created] = await SystemSettings.findOrCreate({
          where: {},
          defaults: {
            business_name: "Zohar Media",
            business_description: "",
            industry: "",
            website_url: "",
            contact_email: "",
            theme: Theme.LIGHT,
          },
        });

        await settings.update({
          business_name:
            business_name !== undefined
              ? business_name
              : settings.business_name,
          business_description:
            business_description !== undefined
              ? business_description
              : settings.business_description,
          industry: industry !== undefined ? industry : settings.industry,
          website_url:
            website_url !== undefined ? website_url : settings.website_url,
          contact_email:
            contact_email !== undefined
              ? contact_email
              : settings.contact_email,
          theme: theme !== undefined ? theme : settings.theme,
        });

        // Log the activity
        await ActivityLog.create({
          user_id: context.user?.id,
          action: "updated",
          entity_type: "system_settings",
          entity_id: settings.id,
          description: "System settings updated",
        });

        return {
          success: true,
          message: created
            ? "System settings created successfully"
            : "System settings updated successfully",
          settings,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update system settings"
        );
      }
    },
    createActivityLog: async (
      _: any,
      {
        action,
        entity_type,
        entity_id,
        description,
        metadata,
      }: {
        action: string;
        entity_type: string;
        entity_id?: string;
        description?: string;
        metadata?: object;
      },
      context: MyContext
    ) => {
      try {
        const activityLog = await ActivityLog.create({
          user_id: context.user?.id,
          action,
          entity_type,
          entity_id,
          description,
          metadata,
        });

        return {
          success: true,
          message: "Activity log created successfully",
          activityLog,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to create activity log"
        );
      }
    },
  },
};

export default systemResolvers;

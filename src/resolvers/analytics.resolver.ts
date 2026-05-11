import { MyContext } from "../index";
import { requireAuth } from "../utils/graphql-auth";
import AnalyticsData from "../models/analytics_data.model";
import BusinessStatistics from "../models/business_statistics.model";
import { getOrCreateAnalyticsForToday } from "../utils/analytics-day";

const analyticsResolvers = {
  Query: {
    analyticsData: async (
      _: any,
      {
        start_date,
        end_date,
        limit = 30,
        offset = 0,
      }: {
        start_date?: string;
        end_date?: string;
        limit?: number;
        offset?: number;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const where: any = {};
        if (start_date && end_date) {
          where.date = {
            [require("sequelize").Op.between]: [
              new Date(start_date),
              new Date(end_date),
            ],
          };
        }

        const analyticsData = await AnalyticsData.findAndCountAll({
          where,
          limit,
          offset,
          order: [["date", "DESC"]],
        });

        return {
          items: analyticsData.rows,
          total: analyticsData.count,
        };
      } catch (error) {
        throw new Error("Failed to fetch analytics data");
      }
    },
    businessStatistics: async (_: any, __: any, context: MyContext) => {
      try {
        const statistics = await BusinessStatistics.findOne();
        if (!statistics) {
          const defaultStats = await BusinessStatistics.create({
            completed_projects: 0,
            happy_clients: 0,
            perspective_clients: 0,
            total_revenue: 0,
            average_project_value: 0,
            is_public: true,
            auto_update: true,
          });
          if (!context.user?.id) {
            const p = defaultStats.get({ plain: true }) as Record<
              string,
              unknown
            >;
            return {
              ...p,
              total_revenue: 0,
              average_project_value: 0,
            };
          }
          return defaultStats;
        }
        if (!context.user?.id) {
          const p = statistics.get({ plain: true }) as Record<string, unknown>;
          return {
            ...p,
            total_revenue: 0,
            average_project_value: 0,
          };
        }
        return statistics;
      } catch (error) {
        throw new Error("Failed to fetch business statistics");
      }
    },
  },
  Mutation: {
    updateAnalyticsData: async (
      _: any,
      {
        date,
        visitors_today,
        visitors_this_week,
        visitors_this_month,
        visitor_trend,
        inquiries_total,
        inquiries_this_month,
        inquiry_trend,
        media_total_views,
      }: {
        date: string;
        visitors_today?: number;
        visitors_this_week?: number;
        visitors_this_month?: number;
        visitor_trend?: number;
        inquiries_total?: number;
        inquiries_this_month?: number;
        inquiry_trend?: number;
        media_total_views?: number;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const [analyticsData, created] = await AnalyticsData.findOrCreate({
          where: { date: new Date(date) },
          defaults: {
            visitors_today: 0,
            visitors_this_week: 0,
            visitors_this_month: 0,
            visitor_trend: 0,
            inquiries_total: 0,
            inquiries_this_month: 0,
            inquiry_trend: 0,
            media_total_views: 0,
          },
        });

        await analyticsData.update({
          visitors_today:
            visitors_today !== undefined
              ? visitors_today
              : analyticsData.visitors_today,
          visitors_this_week:
            visitors_this_week !== undefined
              ? visitors_this_week
              : analyticsData.visitors_this_week,
          visitors_this_month:
            visitors_this_month !== undefined
              ? visitors_this_month
              : analyticsData.visitors_this_month,
          visitor_trend:
            visitor_trend !== undefined
              ? visitor_trend
              : analyticsData.visitor_trend,
          inquiries_total:
            inquiries_total !== undefined
              ? inquiries_total
              : analyticsData.inquiries_total,
          inquiries_this_month:
            inquiries_this_month !== undefined
              ? inquiries_this_month
              : analyticsData.inquiries_this_month,
          inquiry_trend:
            inquiry_trend !== undefined
              ? inquiry_trend
              : analyticsData.inquiry_trend,
          media_total_views:
            media_total_views !== undefined
              ? media_total_views
              : analyticsData.media_total_views,
        });

        return {
          success: true,
          message: created
            ? "Analytics data created successfully"
            : "Analytics data updated successfully",
          analyticsData,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update analytics data",
        );
      }
    },
    updateBusinessStatistics: async (
      _: any,
      {
        completed_projects,
        happy_clients,
        perspective_clients,
        total_revenue,
        average_project_value,
        is_public,
        auto_update,
      }: {
        completed_projects?: number;
        happy_clients?: number;
        perspective_clients?: number;
        total_revenue?: number;
        average_project_value?: number;
        is_public?: boolean;
        auto_update?: boolean;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const [statistics, created] = await BusinessStatistics.findOrCreate({
          where: {},
          defaults: {
            completed_projects: 0,
            happy_clients: 0,
            perspective_clients: 0,
            total_revenue: 0,
            average_project_value: 0,
            is_public: true,
            auto_update: true,
          },
        });

        await statistics.update({
          completed_projects:
            completed_projects !== undefined
              ? completed_projects
              : statistics.completed_projects,
          happy_clients:
            happy_clients !== undefined
              ? happy_clients
              : statistics.happy_clients,
          perspective_clients:
            perspective_clients !== undefined
              ? perspective_clients
              : statistics.perspective_clients,
          total_revenue:
            total_revenue !== undefined
              ? total_revenue
              : statistics.total_revenue,
          average_project_value:
            average_project_value !== undefined
              ? average_project_value
              : statistics.average_project_value,
          is_public: is_public !== undefined ? is_public : statistics.is_public,
          auto_update:
            auto_update !== undefined ? auto_update : statistics.auto_update,
        });

        return {
          success: true,
          message: created
            ? "Business statistics created successfully"
            : "Business statistics updated successfully",
          statistics,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update business statistics",
        );
      }
    },

    recordPortfolioPageVisit: async (
      _: unknown,
      __: unknown,
      _context: MyContext,
    ) => {
      try {
        const row = await getOrCreateAnalyticsForToday();
        await row.increment({ visitors_today: 1 });
        return {
          success: true,
          message: "Visit recorded",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to record page visit",
        );
      }
    },
  },
};

export default analyticsResolvers;

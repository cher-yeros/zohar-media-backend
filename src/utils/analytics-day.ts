import AnalyticsData from "../models/analytics_data.model";

const zeroAnalytics = () => ({
  visitors_today: 0,
  visitors_this_week: 0,
  visitors_this_month: 0,
  visitor_trend: 0,
  inquiries_total: 0,
  inquiries_this_month: 0,
  inquiry_trend: 0,
  media_total_views: 0,
});

/** Calendar day (UTC date string) for DATEONLY row — matches dashboard ordering. */
export function todayAnalyticsDate(): Date {
  const ymd = new Date().toISOString().slice(0, 10);
  return new Date(ymd + "T12:00:00.000Z");
}

export async function getOrCreateAnalyticsForToday(): Promise<AnalyticsData> {
  const date = todayAnalyticsDate();
  const [row] = await AnalyticsData.findOrCreate({
    where: { date },
    defaults: {
      date,
      ...zeroAnalytics(),
    },
  });
  return row;
}

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: Date; output: Date };
  JSON: { input: object; output: object };
}

export interface ActivityLogType {
  __typename?: "ActivityLog";
  action: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  description?: Scalars["String"]["output"];
  entity_id?: Scalars["ID"]["output"];
  entity_type: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  metadata?: Scalars["JSON"]["output"];
  user?: UserType;
  user_id?: Scalars["ID"]["output"];
}

export interface ActivityLogResponseType {
  __typename?: "ActivityLogResponse";
  activityLog?: ActivityLogType;
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
}

export interface ActivityLogsResponseType {
  __typename?: "ActivityLogsResponse";
  items: Array<ActivityLogType>;
  total: Scalars["Int"]["output"];
}

export interface AnalyticsDataType {
  __typename?: "AnalyticsData";
  createdAt: Scalars["Date"]["output"];
  date: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  inquiries_this_month: Scalars["Int"]["output"];
  inquiries_total: Scalars["Int"]["output"];
  inquiry_trend: Scalars["Float"]["output"];
  media_total_views: Scalars["Int"]["output"];
  updated_at: Scalars["Date"]["output"];
  visitor_trend: Scalars["Float"]["output"];
  visitors_this_month: Scalars["Int"]["output"];
  visitors_this_week: Scalars["Int"]["output"];
  visitors_today: Scalars["Int"]["output"];
}

export interface AnalyticsDataMutationResponseType {
  __typename?: "AnalyticsDataMutationResponse";
  analyticsData?: AnalyticsDataType;
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
}

export interface AnalyticsDataResponseType {
  __typename?: "AnalyticsDataResponse";
  items: Array<AnalyticsDataType>;
  total: Scalars["Int"]["output"];
}

export interface BusinessStatisticsType {
  __typename?: "BusinessStatistics";
  auto_update: Scalars["Boolean"]["output"];
  average_project_value: Scalars["Float"]["output"];
  completed_projects: Scalars["Int"]["output"];
  createdAt: Scalars["Date"]["output"];
  happy_clients: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  is_public: Scalars["Boolean"]["output"];
  perspective_clients: Scalars["Int"]["output"];
  total_revenue: Scalars["Float"]["output"];
  updated_at: Scalars["Date"]["output"];
}

export interface BusinessStatisticsResponseType {
  __typename?: "BusinessStatisticsResponse";
  message: Scalars["String"]["output"];
  statistics?: BusinessStatisticsType;
  success: Scalars["Boolean"]["output"];
}

export interface InquiriesResponseType {
  __typename?: "InquiriesResponse";
  items: Array<InquiryType>;
  total: Scalars["Int"]["output"];
}

export interface InquiryType {
  __typename?: "Inquiry";
  assigned_team_member?: TeamMemberType;
  assigned_to?: Scalars["ID"]["output"];
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  inquiry_date: Scalars["Date"]["output"];
  message: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  response?: Scalars["String"]["output"];
  response_date?: Scalars["Date"]["output"];
  status: InquiryStatusType;
  subject: Scalars["String"]["output"];
  type: InquiryTypeType;
  updated_at: Scalars["Date"]["output"];
}

export interface InquiryResponseType {
  __typename?: "InquiryResponse";
  inquiry?: InquiryType;
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
}

export type InquiryStatusType = "RESOLVED" | "RESPONDED" | "UNREAD";

export type InquiryTypeType =
  | "COLLABORATION"
  | "GENERAL"
  | "PRICING"
  | "SUPPORT";

export interface LoginResponseType {
  __typename?: "LoginResponse";
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  token?: Scalars["String"]["output"];
  user?: UserType;
}

export interface MediaItemType {
  __typename?: "MediaItem";
  createdAt: Scalars["Date"]["output"];
  dimensions?: Scalars["String"]["output"];
  duration?: Scalars["String"]["output"];
  file_size?: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  tags: Array<MediaItemTagType>;
  thumbnail_url?: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  type: MediaTypeType;
  updated_at: Scalars["Date"]["output"];
  upload_date: Scalars["Date"]["output"];
  url: Scalars["String"]["output"];
}

export interface MediaItemResponseType {
  __typename?: "MediaItemResponse";
  mediaItem?: MediaItemType;
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
}

export interface MediaItemTagType {
  __typename?: "MediaItemTag";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  media_item: MediaItemType;
  media_item_id: Scalars["ID"]["output"];
  tag_name: Scalars["String"]["output"];
}

export interface MediaItemsResponseType {
  __typename?: "MediaItemsResponse";
  items: Array<MediaItemType>;
  total: Scalars["Int"]["output"];
}

export type MediaTypeType = "IMAGE" | "VIDEO";

export interface MutationcreateActivityLogArgsType {
  action: Scalars["String"]["input"];
  description?: Scalars["String"]["input"];
  entity_id?: Scalars["ID"]["input"];
  entity_type: Scalars["String"]["input"];
  metadata?: Scalars["JSON"]["input"];
}

export interface MutationcreateInquiryArgsType {
  email: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  subject: Scalars["String"]["input"];
  type?: InquiryTypeType;
}

export interface MutationcreateMediaItemArgsType {
  dimensions?: Scalars["String"]["input"];
  duration?: Scalars["String"]["input"];
  file_size?: Scalars["String"]["input"];
  tags?: Array<Scalars["String"]["input"]>;
  thumbnail_url?: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  type: MediaTypeType;
  url: Scalars["String"]["input"];
}

export interface MutationcreatePortfolioCategoryArgsType {
  color: Scalars["String"]["input"];
  description?: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
}

export interface MutationcreatePortfolioItemArgsType {
  category_id?: Scalars["ID"]["input"];
  client_name?: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  featured?: Scalars["Boolean"]["input"];
  images?: Array<PortfolioItemImageInputType>;
  project_date: Scalars["String"]["input"];
  project_url?: Scalars["String"]["input"];
  status?: PortfolioItemStatusType;
  tags?: Array<Scalars["String"]["input"]>;
  team_members?: Array<PortfolioItemTeamMemberInputType>;
  technologies?: Array<Scalars["String"]["input"]>;
  testimonial?: Scalars["String"]["input"];
  thumbnail_url?: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
}

export interface MutationcreateTeamMemberArgsType {
  avatar_url?: Scalars["String"]["input"];
  bio?: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  join_date: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  phone?: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  skills?: Array<Scalars["String"]["input"]>;
  social_links?: Array<SocialLinkInputType>;
  status?: TeamMemberStatusType;
}

export interface MutationcreateTestimonialArgsType {
  avatar_url?: Scalars["String"]["input"];
  company?: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  portfolio_item_id?: Scalars["ID"]["input"];
  rating?: Scalars["Int"]["input"];
  testimonial_date: Scalars["String"]["input"];
}

export interface MutationcreateUserArgsType {
  avatar_url?: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  role?: UserRoleType;
}

export interface MutationdeleteInquiryArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteMediaItemArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeletePortfolioCategoryArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeletePortfolioItemArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteTeamMemberArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteTestimonialArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteUserArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationloginUserArgsType {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}

export interface MutationupdateAnalyticsDataArgsType {
  date: Scalars["String"]["input"];
  inquiries_this_month?: Scalars["Int"]["input"];
  inquiries_total?: Scalars["Int"]["input"];
  inquiry_trend?: Scalars["Float"]["input"];
  media_total_views?: Scalars["Int"]["input"];
  visitor_trend?: Scalars["Float"]["input"];
  visitors_this_month?: Scalars["Int"]["input"];
  visitors_this_week?: Scalars["Int"]["input"];
  visitors_today?: Scalars["Int"]["input"];
}

export interface MutationupdateBusinessStatisticsArgsType {
  auto_update?: Scalars["Boolean"]["input"];
  average_project_value?: Scalars["Float"]["input"];
  completed_projects?: Scalars["Int"]["input"];
  happy_clients?: Scalars["Int"]["input"];
  is_public?: Scalars["Boolean"]["input"];
  perspective_clients?: Scalars["Int"]["input"];
  total_revenue?: Scalars["Float"]["input"];
}

export interface MutationupdateInquiryArgsType {
  assigned_to?: Scalars["ID"]["input"];
  id: Scalars["ID"]["input"];
  response?: Scalars["String"]["input"];
  status?: InquiryStatusType;
}

export interface MutationupdateMediaItemArgsType {
  dimensions?: Scalars["String"]["input"];
  duration?: Scalars["String"]["input"];
  file_size?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  tags?: Array<Scalars["String"]["input"]>;
  thumbnail_url?: Scalars["String"]["input"];
  title?: Scalars["String"]["input"];
  type?: MediaTypeType;
  url?: Scalars["String"]["input"];
}

export interface MutationupdatePortfolioCategoryArgsType {
  color?: Scalars["String"]["input"];
  description?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  name?: Scalars["String"]["input"];
}

export interface MutationupdatePortfolioItemArgsType {
  category_id?: Scalars["ID"]["input"];
  client_name?: Scalars["String"]["input"];
  description?: Scalars["String"]["input"];
  featured?: Scalars["Boolean"]["input"];
  id: Scalars["ID"]["input"];
  images?: Array<PortfolioItemImageInputType>;
  project_date?: Scalars["String"]["input"];
  project_url?: Scalars["String"]["input"];
  status?: PortfolioItemStatusType;
  tags?: Array<Scalars["String"]["input"]>;
  team_members?: Array<PortfolioItemTeamMemberInputType>;
  technologies?: Array<Scalars["String"]["input"]>;
  testimonial?: Scalars["String"]["input"];
  thumbnail_url?: Scalars["String"]["input"];
  title?: Scalars["String"]["input"];
}

export interface MutationupdateSystemSettingsArgsType {
  business_description?: Scalars["String"]["input"];
  business_name?: Scalars["String"]["input"];
  contact_email?: Scalars["String"]["input"];
  industry?: Scalars["String"]["input"];
  theme?: ThemeType;
  website_url?: Scalars["String"]["input"];
}

export interface MutationupdateTeamMemberArgsType {
  avatar_url?: Scalars["String"]["input"];
  bio?: Scalars["String"]["input"];
  email?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  join_date?: Scalars["String"]["input"];
  name?: Scalars["String"]["input"];
  phone?: Scalars["String"]["input"];
  role?: Scalars["String"]["input"];
  skills?: Array<Scalars["String"]["input"]>;
  social_links?: Array<SocialLinkInputType>;
  status?: TeamMemberStatusType;
}

export interface MutationupdateTestimonialArgsType {
  avatar_url?: Scalars["String"]["input"];
  company?: Scalars["String"]["input"];
  featured?: Scalars["Boolean"]["input"];
  id: Scalars["ID"]["input"];
  message?: Scalars["String"]["input"];
  name?: Scalars["String"]["input"];
  portfolio_item_id?: Scalars["ID"]["input"];
  rating?: Scalars["Int"]["input"];
  status?: TestimonialStatusType;
  testimonial_date?: Scalars["String"]["input"];
}

export interface MutationupdateUserArgsType {
  avatar_url?: Scalars["String"]["input"];
  email?: Scalars["String"]["input"];
  first_name?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  is_active?: Scalars["Boolean"]["input"];
  last_name?: Scalars["String"]["input"];
  role?: UserRoleType;
}

export interface PortfolioCategoryType {
  __typename?: "PortfolioCategory";
  color: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  description?: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  portfolio_items: Array<PortfolioItemType>;
  updated_at: Scalars["Date"]["output"];
}

export interface PortfolioCategoryResponseType {
  __typename?: "PortfolioCategoryResponse";
  category?: PortfolioCategoryType;
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
}

export interface PortfolioItemType {
  __typename?: "PortfolioItem";
  category?: PortfolioCategoryType;
  category_id?: Scalars["ID"]["output"];
  client_name?: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  description: Scalars["String"]["output"];
  featured: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  images: Array<PortfolioItemImageType>;
  project_date: Scalars["Date"]["output"];
  project_url?: Scalars["String"]["output"];
  status: PortfolioItemStatusType;
  tags: Array<PortfolioItemTagType>;
  team_members: Array<PortfolioItemTeamMemberType>;
  technologies: Array<PortfolioItemTechnologyType>;
  testimonial?: Scalars["String"]["output"];
  testimonials: Array<TestimonialType>;
  thumbnail_url?: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updated_at: Scalars["Date"]["output"];
}

export interface PortfolioItemImageType {
  __typename?: "PortfolioItemImage";
  alt_text?: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  image_url: Scalars["String"]["output"];
  portfolio_item: PortfolioItemType;
  portfolio_item_id: Scalars["ID"]["output"];
  sort_order: Scalars["Int"]["output"];
}

export type PortfolioItemImageInputType = {
  alt_text?: Scalars["String"]["input"];
  image_url: Scalars["String"]["input"];
  sort_order?: Scalars["Int"]["input"];
};

export interface PortfolioItemResponseType {
  __typename?: "PortfolioItemResponse";
  message: Scalars["String"]["output"];
  portfolioItem?: PortfolioItemType;
  success: Scalars["Boolean"]["output"];
}

export type PortfolioItemStatusType = "COMPLETED" | "DRAFT" | "IN_PROGRESS";

export interface PortfolioItemTagType {
  __typename?: "PortfolioItemTag";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  portfolio_item: PortfolioItemType;
  portfolio_item_id: Scalars["ID"]["output"];
  tag_name: Scalars["String"]["output"];
}

export interface PortfolioItemTeamMemberType {
  __typename?: "PortfolioItemTeamMember";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  portfolio_item: PortfolioItemType;
  portfolio_item_id: Scalars["ID"]["output"];
  role?: Scalars["String"]["output"];
  team_member: TeamMemberType;
  team_member_id: Scalars["ID"]["output"];
}

export type PortfolioItemTeamMemberInputType = {
  role?: Scalars["String"]["input"];
  team_member_id: Scalars["ID"]["input"];
};

export interface PortfolioItemTechnologyType {
  __typename?: "PortfolioItemTechnology";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  portfolio_item: PortfolioItemType;
  portfolio_item_id: Scalars["ID"]["output"];
  technology_name: Scalars["String"]["output"];
}

export interface PortfolioItemsResponseType {
  __typename?: "PortfolioItemsResponse";
  items: Array<PortfolioItemType>;
  total: Scalars["Int"]["output"];
}

export interface QueryactivityLogsArgsType {
  entity_type?: Scalars["String"]["input"];
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  user_id?: Scalars["ID"]["input"];
}

export interface QueryanalyticsDataArgsType {
  end_date?: Scalars["String"]["input"];
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  start_date?: Scalars["String"]["input"];
}

export interface QueryinquiriesArgsType {
  assigned_to?: Scalars["ID"]["input"];
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  status?: InquiryStatusType;
  type?: InquiryTypeType;
}

export interface QueryinquiryArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerymediaItemArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerymediaItemsArgsType {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  type?: MediaTypeType;
}

export interface QueryportfolioCategoryArgsType {
  id: Scalars["ID"]["input"];
}

export interface QueryportfolioItemArgsType {
  id: Scalars["ID"]["input"];
}

export interface QueryportfolioItemsArgsType {
  category_id?: Scalars["ID"]["input"];
  featured?: Scalars["Boolean"]["input"];
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  status?: PortfolioItemStatusType;
}

export interface QueryteamMemberArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerytestimonialArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerytestimonialsArgsType {
  featured?: Scalars["Boolean"]["input"];
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  portfolio_item_id?: Scalars["ID"]["input"];
  status?: TestimonialStatusType;
}

export interface QueryuserArgsType {
  id: Scalars["ID"]["input"];
}

export type SocialLinkInputType = {
  platform: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export interface SystemSettingsType {
  __typename?: "SystemSettings";
  business_description?: Scalars["String"]["output"];
  business_name: Scalars["String"]["output"];
  contact_email?: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  industry?: Scalars["String"]["output"];
  theme: ThemeType;
  updated_at: Scalars["Date"]["output"];
  website_url?: Scalars["String"]["output"];
}

export interface SystemSettingsResponseType {
  __typename?: "SystemSettingsResponse";
  message: Scalars["String"]["output"];
  settings?: SystemSettingsType;
  success: Scalars["Boolean"]["output"];
}

export interface TeamMemberType {
  __typename?: "TeamMember";
  assigned_inquiries: Array<InquiryType>;
  avatar_url?: Scalars["String"]["output"];
  bio?: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  join_date: Scalars["Date"]["output"];
  name: Scalars["String"]["output"];
  phone?: Scalars["String"]["output"];
  portfolio_items: Array<PortfolioItemTeamMemberType>;
  role: Scalars["String"]["output"];
  skills: Array<TeamMemberSkillType>;
  social_links: Array<TeamMemberSocialLinkType>;
  status: TeamMemberStatusType;
  updated_at: Scalars["Date"]["output"];
}

export interface TeamMemberResponseType {
  __typename?: "TeamMemberResponse";
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  teamMember?: TeamMemberType;
}

export interface TeamMemberSkillType {
  __typename?: "TeamMemberSkill";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  skill_name: Scalars["String"]["output"];
  team_member: TeamMemberType;
  team_member_id: Scalars["ID"]["output"];
}

export interface TeamMemberSocialLinkType {
  __typename?: "TeamMemberSocialLink";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  platform: Scalars["String"]["output"];
  team_member: TeamMemberType;
  team_member_id: Scalars["ID"]["output"];
  url: Scalars["String"]["output"];
}

export type TeamMemberStatusType = "ACTIVE" | "INACTIVE";

export interface TestimonialType {
  __typename?: "Testimonial";
  avatar_url?: Scalars["String"]["output"];
  company?: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  featured: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  message: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  portfolio_item?: PortfolioItemType;
  portfolio_item_id?: Scalars["ID"]["output"];
  rating?: Scalars["Int"]["output"];
  status: TestimonialStatusType;
  testimonial_date: Scalars["Date"]["output"];
  updated_at: Scalars["Date"]["output"];
}

export interface TestimonialResponseType {
  __typename?: "TestimonialResponse";
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  testimonial?: TestimonialType;
}

export type TestimonialStatusType = "APPROVED" | "PENDING" | "REJECTED";

export interface TestimonialsResponseType {
  __typename?: "TestimonialsResponse";
  items: Array<TestimonialType>;
  total: Scalars["Int"]["output"];
}

export type ThemeType = "DARK" | "LIGHT";

export interface UserType {
  __typename?: "User";
  activity_logs?: Array<ActivityLogType>;
  avatar_url?: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  is_active: Scalars["Boolean"]["output"];
  last_login_at?: Scalars["Date"]["output"];
  last_name: Scalars["String"]["output"];
  role: UserRoleType;
  updated_at: Scalars["Date"]["output"];
}

export interface UserResponseType {
  __typename?: "UserResponse";
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  user?: UserType;
}

export type UserRoleType = "ADMIN" | "EDITOR" | "MANAGER";

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

export interface BibleStudyApplicationType {
  __typename?: "BibleStudyApplication";
  bible_study_session?: BibleStudySessionType;
  createdAt: Scalars["Date"]["output"];
  date?: Scalars["Date"]["output"];
  description?: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  payment_amount: Scalars["Float"]["output"];
  paymnet?: PaymentType;
  phone: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  title?: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
  zoom_id?: Scalars["String"]["output"];
  zoom_link?: Scalars["String"]["output"];
  zoom_passcode?: Scalars["String"]["output"];
}

export interface BibleStudySessionType {
  __typename?: "BibleStudySession";
  createdAt: Scalars["Date"]["output"];
  date: Scalars["Date"]["output"];
  description: Scalars["String"]["output"];
  end_time: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  payment_amount_etb: Scalars["Float"]["output"];
  payment_amount_usd: Scalars["Float"]["output"];
  picture: Scalars["String"]["output"];
  start_time: Scalars["Date"]["output"];
  status: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  zoom_id: Scalars["String"]["output"];
  zoom_link: Scalars["String"]["output"];
  zoom_passcode: Scalars["String"]["output"];
}

export interface BibleStudySessionForUserType {
  __typename?: "BibleStudySessionForUser";
  createdAt: Scalars["Date"]["output"];
  date: Scalars["Date"]["output"];
  description: Scalars["String"]["output"];
  end_time: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  payment_amount_etb: Scalars["Float"]["output"];
  payment_amount_usd: Scalars["Float"]["output"];
  picture: Scalars["String"]["output"];
  start_time: Scalars["Date"]["output"];
  title: Scalars["String"]["output"];
}

export interface BlogType {
  __typename?: "Blog";
  body: Scalars["String"]["output"];
  category?: CategoryType;
  createdAt: Scalars["Date"]["output"];
  excerpt: Scalars["String"]["output"];
  featured: Scalars["Boolean"]["output"];
  id: Scalars["Int"]["output"];
  image: Scalars["String"]["output"];
  slug: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface BookPurchaseType {
  __typename?: "BookPurchase";
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  payment_method: Scalars["String"]["output"];
  paymnet?: PaymentType;
  phone: Scalars["String"]["output"];
  tx_ref: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export type BulkEmailInputType = {
  body: Scalars["String"]["input"];
  subject: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export interface CategoryType {
  __typename?: "Category";
  blogs: Array<BlogType>;
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface ChapaPaymentResponseType {
  __typename?: "ChapaPaymentResponse";
  data: ChapaPaymentResponseDataType;
  message: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
}

export interface ChapaPaymentResponseDataType {
  __typename?: "ChapaPaymentResponseData";
  checkout_url: Scalars["String"]["output"];
}

export type ConfirmPaymentInputType = {
  paid: Scalars["Boolean"]["input"];
  payment_id: Scalars["Int"]["input"];
};

export type CreateBibleStudyApplicationInputType = {
  bible_study_session_id?: Scalars["Int"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  payment_amount: Scalars["Float"]["input"];
  payment_method: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type CreateBibleStudySessionInputType = {
  date: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  end_time: Scalars["Date"]["input"];
  payment_amount_etb: Scalars["Float"]["input"];
  payment_amount_usd: Scalars["Float"]["input"];
  picture: Scalars["String"]["input"];
  start_time: Scalars["Date"]["input"];
  title: Scalars["String"]["input"];
  zoom_id: Scalars["String"]["input"];
  zoom_link: Scalars["String"]["input"];
  zoom_passcode: Scalars["String"]["input"];
};

export type CreateBlogInputType = {
  body: Scalars["String"]["input"];
  categoryId: Scalars["Int"]["input"];
  excerpt: Scalars["String"]["input"];
  image?: Scalars["String"]["input"];
  slug?: Scalars["String"]["input"];
  tags?: Array<Scalars["Int"]["input"]>;
  title: Scalars["String"]["input"];
};

export type CreateBookPurchaseInputType = {
  amount: Scalars["Float"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  payment_method: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type CreateCategoryInputType = {
  title: Scalars["String"]["input"];
};

export type CreateDonationInputType = {
  additional_message?: Scalars["String"]["input"];
  amount: Scalars["Float"]["input"];
  currency: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  payment_id?: Scalars["Int"]["input"];
  payment_method: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type CreateFAQInputType = {
  answer: Scalars["String"]["input"];
  question: Scalars["String"]["input"];
};

export type CreateFeedbackInputType = {
  email: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  subject: Scalars["String"]["input"];
};

export type CreateGalleryCategoryInputType = {
  title: Scalars["String"]["input"];
};

export type CreateGalleryInputType = {
  city: Scalars["String"]["input"];
  gallery_category_id: Scalars["Int"]["input"];
  images: Array<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type CreatePackageInputType = {
  description?: Scalars["String"]["input"];
  features: Scalars["JSON"]["input"];
  name: Scalars["String"]["input"];
  picture: Scalars["String"]["input"];
  price_etb: Scalars["Float"]["input"];
  price_usd: Scalars["Float"]["input"];
};

export type CreatePartnerInputType = {
  address?: Scalars["String"]["input"];
  currency: Scalars["String"]["input"];
  dob?: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  gender?: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  package_id: Scalars["Int"]["input"];
  password?: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type CreatePartnershipInputType = {
  additional_message: Scalars["String"]["input"];
  address?: Scalars["String"]["input"];
  amount: Scalars["Float"]["input"];
  church_name?: Scalars["String"]["input"];
  currency?: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  partnership_plan?: Scalars["String"]["input"];
  partnership_type: Scalars["String"]["input"];
  payment_method: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  plan?: Scalars["String"]["input"];
};

export type CreatePaymentInputType = {
  amount: Scalars["Float"]["input"];
  contract_id: Scalars["Int"]["input"];
  freelancer_id: Scalars["Int"]["input"];
};

export type CreatePrayerRequestInputType = {
  address: Scalars["String"]["input"];
  age: Scalars["Int"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  gender: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  other_prayer_issue?: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  prayer_issue: Scalars["String"]["input"];
  prayer_issue_description: Scalars["String"]["input"];
};

export type CreateServiceCategoryInputType = {
  playlist_link: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateServiceInputType = {
  service_category_id: Scalars["Int"]["input"];
  service_date?: Scalars["Date"]["input"];
  service_day?: Scalars["String"]["input"];
  youtube_link: Scalars["String"]["input"];
};

export type CreateTagInputType = {
  title: Scalars["String"]["input"];
};

export type CreateTeachingCategoryInputType = {
  description: Scalars["String"]["input"];
  picture: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateTeachingInputType = {
  category_id: Scalars["ID"]["input"];
  content_type: TeachingTypeType;
  description: Scalars["String"]["input"];
  file_url: Scalars["String"]["input"];
  owner: Scalars["String"]["input"];
  picture: Scalars["String"]["input"];
  price_etb: Scalars["Float"]["input"];
  price_usd: Scalars["Float"]["input"];
  seo_tags: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  trailer?: Scalars["String"]["input"];
};

export type CreateTeachingReviewInputType = {
  comment?: Scalars["String"]["input"];
  email?: Scalars["String"]["input"];
  name?: Scalars["String"]["input"];
  rating: Scalars["Int"]["input"];
  teaching_id: Scalars["ID"]["input"];
  user_id?: Scalars["ID"]["input"];
};

export type CreateUserInputType = {
  address: Scalars["String"]["input"];
  dob: Scalars["Date"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  gender: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type CreateVisitorInputType = {
  address: Scalars["String"]["input"];
  currency: Scalars["String"]["input"];
  date: Scalars["Date"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  payment_amount: Scalars["Float"]["input"];
  payment_method: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  request_detail: Scalars["String"]["input"];
  user_id?: Scalars["Int"]["input"];
};

export type CreateVisitorScheduleInputType = {
  end_time: Scalars["Date"]["input"];
  payment_amount_etb: Scalars["Float"]["input"];
  payment_amount_usd: Scalars["Float"]["input"];
  pickup_extra_payment_etb: Scalars["Float"]["input"];
  pickup_extra_payment_usd: Scalars["Float"]["input"];
  start_time: Scalars["Date"]["input"];
};

export interface DonationType {
  __typename?: "Donation";
  additional_message?: Scalars["String"]["output"];
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["Date"]["output"];
  currency: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  payment_method: Scalars["String"]["output"];
  paymnet?: PaymentType;
  phone: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export type EditProfileInputType = {
  address: Scalars["String"]["input"];
  dob: Scalars["Date"]["input"];
  email: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  gender: Scalars["String"]["input"];
  id: Scalars["Int"]["input"];
  lastname: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export interface FAQType {
  __typename?: "FAQ";
  answer: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  question: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface FeedbackType {
  __typename?: "Feedback";
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  message: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  phone?: Scalars["String"]["output"];
  subject?: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface GalleryType {
  __typename?: "Gallery";
  category?: GalleryCategoryType;
  city: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  images: Scalars["JSON"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface GalleryCategoryType {
  __typename?: "GalleryCategory";
  createdAt: Scalars["Date"]["output"];
  galleries: Array<GalleryType>;
  id: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export type LoginInputType = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export interface LoginResponseType {
  __typename?: "LoginResponse";
  token: Scalars["String"]["output"];
  user: UserType;
}

export interface MessageType {
  __typename?: "Message";
  content: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  receiver: UserType;
  seen?: Scalars["Boolean"]["output"];
  sender: UserType;
  updatedAt: Scalars["Date"]["output"];
}

export type MessageInputType = {
  content: Scalars["String"]["input"];
  receiver_id: Scalars["Int"]["input"];
};

export interface MutationaddNewPartnerArgsType {
  input?: CreatePartnershipInputType;
}

export interface MutationapplyForBibleStudyArgsType {
  input: CreateBibleStudyApplicationInputType;
}

export interface MutationcaptureBibleStudyOrderArgsType {
  orderID: Scalars["String"]["input"];
}

export interface MutationcaptureBookPurchaseOrderArgsType {
  orderID: Scalars["String"]["input"];
}

export interface MutationcaptureDonationOrderArgsType {
  orderID: Scalars["String"]["input"];
}

export interface MutationcaptureOrderArgsType {
  orderID: Scalars["String"]["input"];
}

export interface MutationcaptureSubscriptionArgsType {
  orderID: Scalars["String"]["input"];
}

export interface MutationcaptureVisitorOrderArgsType {
  orderID: Scalars["String"]["input"];
}

export interface MutationchapaBookPurchaseArgsType {
  input?: CreateBookPurchaseInputType;
}

export interface MutationcloseBibleStudySessionArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationconfirmPaymentArgsType {
  input: ConfirmPaymentInputType;
}

export interface MutationcreateBibleStudyOrderArgsType {
  input?: CreateBibleStudyApplicationInputType;
}

export interface MutationcreateBibleStudySessionArgsType {
  input: CreateBibleStudySessionInputType;
}

export interface MutationcreateBlogArgsType {
  input?: CreateBlogInputType;
}

export interface MutationcreateBookPurchaseOrderArgsType {
  input?: CreateBookPurchaseInputType;
}

export interface MutationcreateCategoryArgsType {
  input?: CreateCategoryInputType;
}

export interface MutationcreateDonationArgsType {
  input?: CreateDonationInputType;
}

export interface MutationcreateDonationOrderArgsType {
  input?: CreateDonationInputType;
}

export interface MutationcreateFAQArgsType {
  input?: CreateFAQInputType;
}

export interface MutationcreateFeedbackArgsType {
  input?: CreateFeedbackInputType;
}

export interface MutationcreateGalleryArgsType {
  input?: CreateGalleryInputType;
}

export interface MutationcreateGalleryCategoryArgsType {
  input?: CreateGalleryCategoryInputType;
}

export interface MutationcreateOrderArgsType {
  input?: CreatePartnershipInputType;
}

export interface MutationcreatePackageArgsType {
  input: CreatePackageInputType;
}

export interface MutationcreatePartnerArgsType {
  input: CreatePartnerInputType;
}

export interface MutationcreatePartnershipArgsType {
  input?: CreatePartnershipInputType;
}

export interface MutationcreatePaymentArgsType {
  input: CreatePaymentInputType;
}

export interface MutationcreatePrayerRequestArgsType {
  input?: CreatePrayerRequestInputType;
}

export interface MutationcreateServiceArgsType {
  input?: CreateServiceInputType;
}

export interface MutationcreateServiceCategoryArgsType {
  input?: CreateServiceCategoryInputType;
}

export interface MutationcreateSubscriptionArgsType {
  input?: CreatePartnershipInputType;
}

export interface MutationcreateTagArgsType {
  input?: CreateTagInputType;
}

export interface MutationcreateTeachingArgsType {
  input: CreateTeachingInputType;
}

export interface MutationcreateTeachingCategoryArgsType {
  input: CreateTeachingCategoryInputType;
}

export interface MutationcreateTeachingReviewArgsType {
  input: CreateTeachingReviewInputType;
}

export interface MutationcreateUserArgsType {
  input?: CreateUserInputType;
}

export interface MutationcreateVisitorArgsType {
  input: CreateVisitorInputType;
}

export interface MutationcreateVisitorOrderArgsType {
  input?: CreateVisitorInputType;
}

export interface MutationcreateVisitorScheduleArgsType {
  input: CreateVisitorScheduleInputType;
}

export interface MutationdeleteBibleStudyApplicationArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeleteBibleStudySessionArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeleteBlogArgsType {
  id?: Scalars["Int"]["input"];
}

export interface MutationdeleteCategoryArgsType {
  id?: Scalars["Int"]["input"];
}

export interface MutationdeleteDonationArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteFAQArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteGalleryArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeleteGalleryCategoryArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeletePackageArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeletePartnerArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeletePrayerRequestArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteServiceArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeleteServiceCategoryArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeleteTagArgsType {
  id?: Scalars["Int"]["input"];
}

export interface MutationdeleteTeachingArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteTeachingCategoryArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteTeachingReviewArgsType {
  id: Scalars["ID"]["input"];
}

export interface MutationdeleteVisitorArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationdeleteVisitorScheduleArgsType {
  id: Scalars["Int"]["input"];
}

export interface MutationeditBlogArgsType {
  input?: UpdateBlogInputType;
}

export interface MutationeditCategoryArgsType {
  input?: UpdateCategoryInputType;
}

export interface MutationeditTagArgsType {
  input?: UpdateTagInputType;
}

export interface MutationloginUserArgsType {
  input?: LoginInputType;
}

export interface MutationregisterBiblesStudyMembersArgsType {
  input: CreateBibleStudyApplicationInputType;
}

export interface MutationrequestResetPasswordArgsType {
  email: Scalars["String"]["input"];
}

export interface MutationresetPasswordArgsType {
  email: Scalars["String"]["input"];
  newPassword: Scalars["String"]["input"];
  resetToken: Scalars["String"]["input"];
}

export interface MutationsendBulkEmailForPartnersArgsType {
  input: BulkEmailInputType;
}

export interface MutationsendBulkEmailForPropheticSchoolMembersArgsType {
  input: BulkEmailInputType;
}

export interface MutationsendMessageArgsType {
  input: MessageInputType;
}

export interface MutationupdateBibleStudySessionArgsType {
  input: UpdateBibleStudySessionInputType;
}

export interface MutationupdateDonationArgsType {
  id: Scalars["ID"]["input"];
  input?: UpdateDonationInputType;
}

export interface MutationupdateFAQArgsType {
  id: Scalars["ID"]["input"];
  input?: UpdateFAQInputType;
}

export interface MutationupdateGalleryArgsType {
  input?: UpdateGalleryInputType;
}

export interface MutationupdateGalleryCategoryArgsType {
  input?: UpdateGalleryCategoryInputType;
}

export interface MutationupdatePackageArgsType {
  id: Scalars["ID"]["input"];
  input: UpdatePackageInputType;
}

export interface MutationupdatePartnerArgsType {
  id: Scalars["ID"]["input"];
  input: UpdatePartnerInputType;
}

export interface MutationupdatePrayerRequestArgsType {
  id: Scalars["ID"]["input"];
  input?: UpdatePrayerRequestInputType;
}

export interface MutationupdateServiceArgsType {
  input?: UpdateServiceInputType;
}

export interface MutationupdateServiceCategoryArgsType {
  input?: UpdateServiceCategoryInputType;
}

export interface MutationupdateTeachingArgsType {
  input: UpdateTeachingInputType;
}

export interface MutationupdateTeachingCategoryArgsType {
  input: UpdateTeachingCategoryInputType;
}

export interface MutationupdateTeachingReviewArgsType {
  input: UpdateTeachingReviewInputType;
}

export interface MutationupdateVisitorScheduleArgsType {
  input: UpdateVisitorScheduleInputType;
}

export interface NotificationType {
  __typename?: "Notification";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  is_read?: Scalars["Boolean"]["output"];
  link: Scalars["JSON"]["output"];
  message: Scalars["String"]["output"];
  recipient?: UserType;
  seen?: Scalars["Boolean"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PackageType {
  __typename?: "Package";
  createdAt: Scalars["Date"]["output"];
  description?: Scalars["String"]["output"];
  features: Scalars["JSON"]["output"];
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  picture: Scalars["String"]["output"];
  price_etb: Scalars["Float"]["output"];
  price_usd: Scalars["Float"]["output"];
  rating: Scalars["Float"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PartnerType {
  __typename?: "Partner";
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PartnershipType {
  __typename?: "Partnership";
  additional_message?: Scalars["String"]["output"];
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["Date"]["output"];
  due_date?: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  partnership_plan?: Scalars["String"]["output"];
  partnership_type: Scalars["String"]["output"];
  payment_method: Scalars["String"]["output"];
  payments: Array<PaymentType>;
  phone: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PartnershipPaymentType {
  __typename?: "PartnershipPayment";
  createdAt: Scalars["Date"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PaymentType {
  __typename?: "Payment";
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["Date"]["output"];
  currency: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  payment_method: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  reason: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  tx_ref: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface PaymentAmountLookupType {
  __typename?: "PaymentAmountLookup";
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  payment_for: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PostTagType {
  __typename?: "PostTag";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface PrayerRequestType {
  __typename?: "PrayerRequest";
  address: Scalars["String"]["output"];
  age: Scalars["Int"]["output"];
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  gender: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  other_prayer_issue?: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  prayer_issue: Scalars["String"]["output"];
  prayer_issue_description?: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface QuerydonationArgsType {
  id: Scalars["ID"]["input"];
}

export interface QueryfaqArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerygetPackageArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerygetPartnerArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerygetTeachingArgsType {
  id: Scalars["ID"]["input"];
}

export interface QuerygetTeachingReviewsArgsType {
  teaching_id: Scalars["ID"]["input"];
}

export interface QuerypartnershipArgsType {
  id: Scalars["Int"]["input"];
}

export interface QueryprayerrequestArgsType {
  id: Scalars["ID"]["input"];
}

export interface QueryuserArgsType {
  id: Scalars["Int"]["input"];
}

export interface QueryverifyEmailArgsType {
  token: Scalars["String"]["input"];
}

export interface ServiceType {
  __typename?: "Service";
  category?: ServiceCategoryType;
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  updatedAt: Scalars["Date"]["output"];
  youtube_link: Scalars["String"]["output"];
}

export interface ServiceCategoryType {
  __typename?: "ServiceCategory";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  playlist_link: Scalars["String"]["output"];
  services: Array<ServiceType>;
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface SubscriptionpaymentSuccessfulArgsType {
  tx_ref?: Scalars["String"]["input"];
}

export interface SubscriptionpaymentVerifiedArgsType {
  tx_ref?: Scalars["String"]["input"];
}

export interface TagType {
  __typename?: "Tag";
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface TeachingType {
  __typename?: "Teaching";
  active: Scalars["Boolean"]["output"];
  category?: TeachingCategoryType;
  content_type: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  description: Scalars["String"]["output"];
  file_url: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  is_downloadable: Scalars["Boolean"]["output"];
  owner: Scalars["String"]["output"];
  picture: Scalars["String"]["output"];
  price_etb: Scalars["Float"]["output"];
  price_usd: Scalars["Float"]["output"];
  seo_tags: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  trailer: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface TeachingCategoryType {
  __typename?: "TeachingCategory";
  createdAt: Scalars["Date"]["output"];
  description: Scalars["JSON"]["output"];
  id: Scalars["Int"]["output"];
  picture: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

export interface TeachingReviewType {
  __typename?: "TeachingReview";
  comment: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  is_visible: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  rating: Scalars["Int"]["output"];
  teaching?: TeachingType;
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface TeachingSubscriptionType {
  __typename?: "TeachingSubscription";
  createdAt: Scalars["Date"]["output"];
  end_date?: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  package?: PackageType;
  payment?: PaymentType;
  start_date?: Scalars["Date"]["output"];
  status: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export type TeachingTypeType =
  | "AUDIO"
  | "EPUB"
  | "PDF"
  | "VIDEO"
  | "YOUTUBE_LIVE"
  | "ZOOM_MEETING";

export interface TokenType {
  __typename?: "Token";
  createdAt: Scalars["Date"]["output"];
  expiryDate: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  token: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export type UpdateBibleStudySessionInputType = {
  date?: Scalars["String"]["input"];
  description?: Scalars["String"]["input"];
  end_time?: Scalars["Date"]["input"];
  id: Scalars["Int"]["input"];
  payment_amount_etb?: Scalars["Float"]["input"];
  payment_amount_usd?: Scalars["Float"]["input"];
  picture?: Scalars["String"]["input"];
  start_time?: Scalars["Date"]["input"];
  title?: Scalars["String"]["input"];
  zoom_id?: Scalars["String"]["input"];
  zoom_link?: Scalars["String"]["input"];
  zoom_passcode?: Scalars["String"]["input"];
};

export type UpdateBlogInputType = {
  body?: Scalars["String"]["input"];
  categoryId?: Scalars["Int"]["input"];
  excerpt?: Scalars["String"]["input"];
  id: Scalars["Int"]["input"];
  image?: Scalars["String"]["input"];
  slug?: Scalars["String"]["input"];
  tags?: Array<Scalars["Int"]["input"]>;
  title?: Scalars["String"]["input"];
};

export type UpdateCategoryInputType = {
  id: Scalars["Int"]["input"];
  title?: Scalars["String"]["input"];
};

export type UpdateDonationInputType = {
  additional_message?: Scalars["String"]["input"];
  amount?: Scalars["Float"]["input"];
  email?: Scalars["String"]["input"];
  first_name?: Scalars["String"]["input"];
  id: Scalars["Int"]["input"];
  last_name?: Scalars["String"]["input"];
  payment_id?: Scalars["Int"]["input"];
  payment_method?: Scalars["String"]["input"];
  phone?: Scalars["String"]["input"];
};

export type UpdateFAQInputType = {
  answer?: Scalars["String"]["input"];
  id: Scalars["Int"]["input"];
  question?: Scalars["String"]["input"];
};

export type UpdateGalleryCategoryInputType = {
  id: Scalars["Int"]["input"];
  title: Scalars["String"]["input"];
};

export type UpdateGalleryInputType = {
  gallery_category_id?: Scalars["Int"]["input"];
  id: Scalars["Int"]["input"];
  image?: Scalars["String"]["input"];
  title?: Scalars["String"]["input"];
};

export type UpdatePackageInputType = {
  description?: Scalars["String"]["input"];
  features?: Scalars["JSON"]["input"];
  id: Scalars["Int"]["input"];
  name?: Scalars["String"]["input"];
  picture?: Scalars["String"]["input"];
  price_etb?: Scalars["Float"]["input"];
  price_usd?: Scalars["Float"]["input"];
};

export type UpdatePartnerInputType = {
  address?: Scalars["String"]["input"];
  currency: Scalars["String"]["input"];
  dob?: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  first_name: Scalars["String"]["input"];
  gender?: Scalars["String"]["input"];
  last_name: Scalars["String"]["input"];
  package_id: Scalars["Int"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type UpdatePrayerRequestInputType = {
  address?: Scalars["String"]["input"];
  age?: Scalars["Int"]["input"];
  email?: Scalars["String"]["input"];
  first_name?: Scalars["String"]["input"];
  gender?: Scalars["String"]["input"];
  id: Scalars["Int"]["input"];
  last_name?: Scalars["String"]["input"];
  other_prayer_issue?: Scalars["String"]["input"];
  phone?: Scalars["String"]["input"];
  prayer_issue?: Scalars["String"]["input"];
  prayer_issue_description?: Scalars["String"]["input"];
};

export type UpdateServiceCategoryInputType = {
  id: Scalars["Int"]["input"];
  playlist_link: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type UpdateServiceInputType = {
  id: Scalars["Int"]["input"];
  service_category_id?: Scalars["Int"]["input"];
  service_date?: Scalars["Date"]["input"];
  service_day?: Scalars["String"]["input"];
  youtube_link?: Scalars["String"]["input"];
};

export type UpdateTagInputType = {
  id: Scalars["Int"]["input"];
  title?: Scalars["String"]["input"];
};

export type UpdateTeachingCategoryInputType = {
  description?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  picture?: Scalars["String"]["input"];
  title?: Scalars["String"]["input"];
};

export type UpdateTeachingInputType = {
  category_id?: Scalars["ID"]["input"];
  content_type?: TeachingTypeType;
  description?: Scalars["String"]["input"];
  file_url?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  is_downloadable?: Scalars["Boolean"]["input"];
  owner?: Scalars["String"]["input"];
  picture?: Scalars["String"]["input"];
  price_etb?: Scalars["Float"]["input"];
  price_usd?: Scalars["Float"]["input"];
  seo_tags?: Scalars["String"]["input"];
  title?: Scalars["String"]["input"];
  trailer?: Scalars["String"]["input"];
};

export type UpdateTeachingReviewInputType = {
  comment?: Scalars["String"]["input"];
  email?: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  is_visible?: Scalars["Boolean"]["input"];
  name?: Scalars["String"]["input"];
  rating?: Scalars["Int"]["input"];
};

export type UpdateVisitorScheduleInputType = {
  end_time?: Scalars["Date"]["input"];
  id: Scalars["Int"]["input"];
  payment_amount_etb?: Scalars["Float"]["input"];
  payment_amount_usd?: Scalars["Float"]["input"];
  pickup_extra_payment_etb?: Scalars["Float"]["input"];
  pickup_extra_payment_usd?: Scalars["Float"]["input"];
  start_time?: Scalars["Date"]["input"];
};

export interface UserType {
  __typename?: "User";
  address?: Scalars["String"]["output"];
  avatar?: Scalars["String"]["output"];
  banned: Scalars["Boolean"]["output"];
  createdAt: Scalars["Date"]["output"];
  dob?: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  gender?: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  last_name: Scalars["String"]["output"];
  password: Scalars["String"]["output"];
  payments: Array<PaymentType>;
  phone?: Scalars["String"]["output"];
  resetToken?: Scalars["String"]["output"];
  resetTokenExpires?: Scalars["Date"]["output"];
  role: Scalars["String"]["output"];
  subscriptions: Array<TeachingSubscriptionType>;
  updatedAt: Scalars["Date"]["output"];
}

export interface VisitorType {
  __typename?: "Visitor";
  address: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  date: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  first_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  last_name: Scalars["String"]["output"];
  paymnet?: PaymentType;
  phone: Scalars["String"]["output"];
  request_detail: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface VisitorForUserType {
  __typename?: "VisitorForUser";
  createdAt: Scalars["Date"]["output"];
  date: Scalars["Date"]["output"];
  description: Scalars["String"]["output"];
  end_time: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  payment_amount: Scalars["Float"]["output"];
  schedule: VisitorScheduleType;
  start_time: Scalars["Date"]["output"];
  title: Scalars["String"]["output"];
}

export interface VisitorScheduleType {
  __typename?: "VisitorSchedule";
  availabile: Scalars["Boolean"]["output"];
  createdAt: Scalars["Date"]["output"];
  date: Scalars["Date"]["output"];
  end_time: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  payment_amount_etb: Scalars["Float"]["output"];
  payment_amount_usd: Scalars["Float"]["output"];
  pickup_extra_payment_etb: Scalars["Float"]["output"];
  pickup_extra_payment_usd: Scalars["Float"]["output"];
  start_time: Scalars["Date"]["output"];
  status: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
}

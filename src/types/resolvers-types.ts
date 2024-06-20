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

export type CreateAdminFeedbackInputType = {
  content: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  subject: Scalars["String"]["input"];
};

export type CreateFeedbackInputType = {
  content: Scalars["String"]["input"];
  to_id: Scalars["Int"]["input"];
};

export type CreatePartnershipInputType = {
  amount: Scalars["Float"]["input"];
  currency: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  lastname: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  payment_method: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  plan: Scalars["String"]["input"];
};

export type CreatePaymentInputType = {
  amount: Scalars["Float"]["input"];
  contract_id: Scalars["Int"]["input"];
  freelancer_id: Scalars["Int"]["input"];
};

export type CreateUserInputType = {
  address: Scalars["String"]["input"];
  dob: Scalars["Date"]["input"];
  email: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  gender: Scalars["String"]["input"];
  lastname: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

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

export interface FeedbackType {
  __typename?: "Feedback";
  content: Scalars["String"]["output"];
  createdAt: Scalars["Date"]["output"];
  from: UserType;
  id: Scalars["Int"]["output"];
  seen: Scalars["Boolean"]["output"];
  to: UserType;
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

export interface MutationconfirmPaymentArgsType {
  input: ConfirmPaymentInputType;
}

export interface MutationcreateFeedbackArgsType {
  input?: CreateFeedbackInputType;
}

export interface MutationcreatePartnershipArgsType {
  input?: CreatePartnershipInputType;
}

export interface MutationcreatePaymentArgsType {
  input: CreatePaymentInputType;
}

export interface MutationcreateUserArgsType {
  input?: CreateUserInputType;
}

export interface MutationloginUserArgsType {
  input?: LoginInputType;
}

export interface MutationsendMessageArgsType {
  input: MessageInputType;
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

export interface PartnershipType {
  __typename?: "Partnership";
  createdAt: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  firstname: Scalars["String"]["output"];
  fullname: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  lastname: Scalars["String"]["output"];
  payments: Array<PaymentType>;
  phone?: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface PaymentType {
  __typename?: "Payment";
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  partnership?: PartnershipType;
  status: Scalars["String"]["output"];
  tx_ref: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface QueryfeedbacksByUserIdArgsType {
  id: Scalars["Int"]["input"];
}

export interface QuerypartnershipArgsType {
  id: Scalars["Int"]["input"];
}

export interface QueryuserArgsType {
  id: Scalars["Int"]["input"];
}

export interface QueryverifyEmailArgsType {
  token: Scalars["String"]["input"];
}

export interface TokenType {
  __typename?: "Token";
  createdAt: Scalars["Date"]["output"];
  expiryDate: Scalars["Date"]["output"];
  id: Scalars["Int"]["output"];
  token: Scalars["String"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user?: UserType;
}

export interface UserType {
  __typename?: "User";
  address?: Scalars["String"]["output"];
  avatar?: Scalars["String"]["output"];
  banned: Scalars["Boolean"]["output"];
  createdAt: Scalars["Date"]["output"];
  dob?: Scalars["Date"]["output"];
  email: Scalars["String"]["output"];
  firstname: Scalars["String"]["output"];
  fullname: Scalars["String"]["output"];
  gender?: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  is_verified: Scalars["Boolean"]["output"];
  lastname: Scalars["String"]["output"];
  partnerships: Array<PartnershipType>;
  password: Scalars["String"]["output"];
  phone?: Scalars["String"]["output"];
  resetToken?: Scalars["String"]["output"];
  resetTokenExpires?: Scalars["Date"]["output"];
  updatedAt: Scalars["Date"]["output"];
  user: Array<PaymentType>;
}

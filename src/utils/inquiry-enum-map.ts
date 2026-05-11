import { InquiryStatus, InquiryType } from "../enums";

/** DB stores lowercase (`unread`, `general`, …); GraphQL enums use UPPERCASE names. */

export function inquiryStatusToGraphQL(
  value: string | InquiryStatus | undefined | null,
): "UNREAD" | "RESPONDED" | "RESOLVED" {
  switch (String(value ?? "").toLowerCase()) {
    case InquiryStatus.RESPONDED:
    case "responded":
      return "RESPONDED";
    case InquiryStatus.RESOLVED:
    case "resolved":
      return "RESOLVED";
    default:
      return "UNREAD";
  }
}

export function inquiryStatusFromGraphQL(value: string): InquiryStatus {
  switch (String(value).toUpperCase()) {
    case "RESPONDED":
      return InquiryStatus.RESPONDED;
    case "RESOLVED":
      return InquiryStatus.RESOLVED;
    default:
      return InquiryStatus.UNREAD;
  }
}

export function inquiryTypeToGraphQL(
  value: string | InquiryType | undefined | null,
): "GENERAL" | "COLLABORATION" | "PRICING" | "SUPPORT" {
  switch (String(value ?? "").toLowerCase()) {
    case InquiryType.COLLABORATION:
    case "collaboration":
      return "COLLABORATION";
    case InquiryType.PRICING:
    case "pricing":
      return "PRICING";
    case InquiryType.SUPPORT:
    case "support":
      return "SUPPORT";
    default:
      return "GENERAL";
  }
}

export function inquiryTypeFromGraphQL(value: string): InquiryType {
  switch (String(value).toUpperCase()) {
    case "COLLABORATION":
      return InquiryType.COLLABORATION;
    case "PRICING":
      return InquiryType.PRICING;
    case "SUPPORT":
      return InquiryType.SUPPORT;
    default:
      return InquiryType.GENERAL;
  }
}

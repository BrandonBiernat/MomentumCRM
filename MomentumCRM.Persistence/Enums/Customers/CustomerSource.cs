namespace MomentumCRM.Persistence.Enums.Customers;

public enum CustomerSource {
    // Inbound / Marketing
    OrganicSearch,
    PaidSearch,
    PaidSocial,
    OrganicSocial,
    ContentBlog,
    EmailCampaign,
    WebinarEvent,

    // Direct
    Direct,
    ColdOutbound,
    WalkIn,

    // Referrals
    CustomerReferral,
    PartnerAffiliate,
    WordOfMouth,

    // Sales-Generated
    TradeShowConference,
    ColdCall,
    LinkedInOutreach,

    // Product-Led
    FreeTrial,
    ProductSignup,
    ApiDeveloperSignup,

    // Other
    PressOrPR,
    ReviewSite,
    Unknown
}
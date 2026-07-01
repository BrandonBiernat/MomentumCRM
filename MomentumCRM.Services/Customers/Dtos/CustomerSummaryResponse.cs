namespace MomentumCRM.Services.Customers.Dtos;

public record CustomerSummaryResponse(
    int All,
    int Lead,
    int Prospect,
    int Active,
    int Inactive
);

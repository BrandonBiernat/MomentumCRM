namespace MomentumCRM.Persistence.Entities;

public record Address(
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country
);

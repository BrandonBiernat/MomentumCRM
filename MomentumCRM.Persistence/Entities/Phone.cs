using MomentumCRM.Persistence.Exceptions;
using PhoneNumbers;

namespace MomentumCRM.Persistence.Entities;

public record Phone {
    public string Number { get; init; }
    public string? Extension { get; init; }

    private Phone(string number, string? extension) {
        Number = number;
        Extension = extension;
    }

    public static Phone Create(
        string rawNumber,
        string? extension = null,
        string defaultRegion = "US") {
        PhoneNumberUtil util = PhoneNumberUtil.GetInstance();
        try {
            PhoneNumber parsed = util.Parse(rawNumber, defaultRegion);
            if (!util.IsValidNumber(parsed))
                throw new InvalidPhoneNumberException(rawNumber);
            return new Phone(
                util.Format(parsed, PhoneNumberFormat.E164),
                extension?.Trim());
        } catch (NumberParseException) {
            throw new InvalidPhoneNumberException(rawNumber);
        }
    }
}
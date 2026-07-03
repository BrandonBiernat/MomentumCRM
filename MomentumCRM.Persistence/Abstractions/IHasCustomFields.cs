using MomentumCRM.Persistence.Entities.CustomFields;

namespace MomentumCRM.Persistence.Abstractions;

public interface IHasCustomFields {
    CustomFieldValues CustomFields { get; }
}

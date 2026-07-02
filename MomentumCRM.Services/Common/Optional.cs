using System.Text.Json;
using System.Text.Json.Serialization;

namespace MomentumCRM.Services.Common;

[JsonConverter(typeof(OptionalJsonConverterFactory))]
public readonly struct Optional<T> {
    public bool HasValue { get; }
    public T? Value { get; }

    public Optional(T? value) {
        HasValue = true;
        Value = value;
    }
}

public class OptionalJsonConverterFactory : JsonConverterFactory {
    public override bool CanConvert(Type typeToConvert) =>
        typeToConvert.IsGenericType &&
        typeToConvert.GetGenericTypeDefinition() == typeof(Optional<>);

    public override JsonConverter CreateConverter(
        Type typeToConvert,
        JsonSerializerOptions options) {
        Type valueType = typeToConvert.GetGenericArguments()[0];
        return (JsonConverter)Activator.CreateInstance(
            typeof(OptionalJsonConverter<>).MakeGenericType(valueType))!;
    }
}

public class OptionalJsonConverter<T> : JsonConverter<Optional<T>> {
    // Read is only invoked when the property is present in the JSON, so
    // producing an Optional here always means HasValue == true.
    public override Optional<T> Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options) =>
        new(JsonSerializer.Deserialize<T>(ref reader, options));

    public override void Write(
        Utf8JsonWriter writer,
        Optional<T> value,
        JsonSerializerOptions options) =>
        JsonSerializer.Serialize(writer, value.Value, options);
}

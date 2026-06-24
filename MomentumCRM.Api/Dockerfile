# Use runtime for final execution
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Build stage using full SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file using the relative path from the context
COPY ["MomentumCRM.Api/Api.csproj", "MomentumCRM.Api/"]
RUN dotnet restore "MomentumCRM.Api/Api.csproj"
COPY . .
WORKDIR "/src/MomentumCRM.Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final production image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]
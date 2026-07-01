using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MomentumCRM.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CustomerSoftDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customers_Domain",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_Email",
                table: "Customers");

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAtUtc",
                table: "Customers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ArchivedBy",
                table: "Customers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_Domain",
                table: "Customers",
                column: "Domain",
                unique: true,
                filter: "\"ArchivedAtUtc\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true,
                filter: "\"ArchivedAtUtc\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customers_Domain",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_Email",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "ArchivedAtUtc",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "ArchivedBy",
                table: "Customers");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_Domain",
                table: "Customers",
                column: "Domain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true);
        }
    }
}

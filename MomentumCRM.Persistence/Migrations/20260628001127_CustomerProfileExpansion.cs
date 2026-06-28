using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MomentumCRM.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CustomerProfileExpansion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address_City",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Country",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_PostalCode",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_State",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Street",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Domain",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone_Extension",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone_Number",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Customers",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Customers",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Customers",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

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
                name: "Address_City",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Address_Country",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Address_PostalCode",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Address_State",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Address_Street",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Domain",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Phone_Extension",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Phone_Number",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Customers");
        }
    }
}

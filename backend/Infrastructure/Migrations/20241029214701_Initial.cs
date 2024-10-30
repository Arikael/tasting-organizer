using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TastingOrganizer.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tastings",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    from = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    to = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    description = table.Column<string>(type: "text", nullable: false),
                    max_people_count = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    price_per_person = table.Column<decimal>(type: "numeric", nullable: false),
                    place = table.Column<string>(type: "text", nullable: false),
                    creator = table.Column<string>(type: "text", nullable: false),
                    organizers = table.Column<string>(type: "text", nullable: false),
                    scoring_type = table.Column<int>(type: "integer", nullable: false),
                    reveal_type = table.Column<int>(type: "integer", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
                    access_code = table.Column<string>(type: "text", nullable: true),
                    is_published = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tastings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "flight",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tasting_id = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    index = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_flight", x => x.id);
                    table.ForeignKey(
                        name: "fk_flight_tastings_tasting_id",
                        column: x => x.tasting_id,
                        principalTable: "tastings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tasting_participant",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: true),
                    needs_to_pay = table.Column<bool>(type: "boolean", nullable: false),
                    pay_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    invited = table.Column<bool>(type: "boolean", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tasting_participant", x => x.id);
                    table.ForeignKey(
                        name: "fk_tasting_participant_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "wine",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    producer = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    retail_price = table.Column<decimal>(type: "numeric", nullable: false),
                    flight_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wine", x => x.id);
                    table.ForeignKey(
                        name: "fk_wine_flight_flight_id",
                        column: x => x.flight_id,
                        principalTable: "flight",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "score",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tasting_participant_id = table.Column<int>(type: "integer", nullable: false),
                    wine_id = table.Column<int>(type: "integer", nullable: false),
                    points = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_score", x => x.id);
                    table.ForeignKey(
                        name: "fk_score_tasting_participant_tasting_participant_id",
                        column: x => x.tasting_participant_id,
                        principalTable: "tasting_participant",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_score_wine_wine_id",
                        column: x => x.wine_id,
                        principalTable: "wine",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_flight_tasting_id",
                table: "flight",
                column: "tasting_id");

            migrationBuilder.CreateIndex(
                name: "ix_score_tasting_participant_id",
                table: "score",
                column: "tasting_participant_id");

            migrationBuilder.CreateIndex(
                name: "ix_score_wine_id",
                table: "score",
                column: "wine_id");

            migrationBuilder.CreateIndex(
                name: "ix_tasting_participant_user_id",
                table: "tasting_participant",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_wine_flight_id",
                table: "wine",
                column: "flight_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "score");

            migrationBuilder.DropTable(
                name: "tasting_participant");

            migrationBuilder.DropTable(
                name: "wine");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "flight");

            migrationBuilder.DropTable(
                name: "tastings");
        }
    }
}

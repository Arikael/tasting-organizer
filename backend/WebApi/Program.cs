using TastingOrganizer.Domain.Extensions;
using TastingOrganizer.Infrastructure.Data;
using TastingOrganizer.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

builder.Services.AddControllers();
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddLogging();

builder.Services.AddDbContext(builder.Configuration.GetConnectionString("postgres"));
builder.Services.AddAllUseCases();
builder.Services.AddAllValidators();
builder.Services.AddAllRepositories();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
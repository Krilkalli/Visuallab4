using Microsoft.EntityFrameworkCore;
using WebApplication2.Repositories;
using WebApplication2.Model;
using WebApplication2.Services;

var builder = WebApplication.CreateBuilder(args);
//// Регистрация DbContext с настройками из конфигурации
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));
//регистрация зависимостей:
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
var app = builder.Build();

app.UseCors("AllowReactApp");


app.MapGet("/comments", (CommentService service) => 
{
    return Results.Ok(service.GetAll());
});

app.MapGet("/comments/{id}", (int id, CommentService service) => 
{
    var comment = service.GetById(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", (Comment comment, CommentService service) => 
{
    var createdComment = service.Add(comment);
    return Results.Created($"/comments/{createdComment.Id}", createdComment);
});

app.MapPatch("/comments/{id}", (int id, Comment comment, CommentService service) => 
{
    var updatedComment = service.Update(id, comment);
    return updatedComment is not null ? Results.Ok(updatedComment) : Results.NotFound();
});

app.MapDelete("/comments/{id}", (int id, CommentService service) => 
{
    service.Delete(id);
    return Results.NoContent();
});

app.Run();
//Модель - Comment.cs определяет структуру данных
//Repository - CommentRepository.cs - отвечает за работу с базой данных
//Service - CommentService - содержит бизнес-логику

// builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
// builder.Services.AddSingleton<CommentService>();
//иньекция когда зависимости не создаются внутри класса, а внедряются извне.
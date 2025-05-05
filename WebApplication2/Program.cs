//настройка системы логирования
using Microsoft.EntityFrameworkCore;
using WebApplication2.Repositories;
using WebApplication2.Model;
using WebApplication2.Services;
using WebApplication2.Logging; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();

builder.Logging.ClearProviders();//Очищаем стандартные провайдеры
builder.Logging.AddConsole();//Добавляем вывод в консоль
builder.Logging.AddProvider(new DatabaseLoggerProvider(builder.Services.BuildServiceProvider()));//Добавляем провайдер

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Создаст все таблицы, если их нет
}

app.UseCors();

app.MapGet("/comments", (CommentService service, ILogger<Program> logger) => 
{
    logger.LogInformation("GET /comments");
    return Results.Ok(service.GetAll());
});

app.MapGet("/comments/{id}", (int id, CommentService service, ILogger<Program> logger) => 
{
    logger.LogInformation("GET /comments/{Id}", id);
    var comment = service.GetById(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", (Comment comment, CommentService service, ILogger<Program> logger) => 
{
    var createdComment = service.Add(comment);
    logger.LogInformation("POST /comments - ID: {Id}", createdComment.Id);
    return Results.Created($"/comments/{createdComment.Id}", createdComment);
});

app.MapPatch("/comments/{id}", (int id, Comment comment, CommentService service, ILogger<Program> logger) => 
{
    logger.LogInformation("PATCH /comments/{Id}", id);
    var updatedComment = service.Update(id, comment);
    return updatedComment is not null ? Results.Ok(updatedComment) : Results.NotFound();
});

app.MapDelete("/comments/{id}", (int id, CommentService service, ILogger<Program> logger) => 
{
    logger.LogInformation("DELETE /comments/{Id}", id);
    service.Delete(id);
    return Results.NoContent();
});

app.MapGet("/logs", (AppDbContext dbContext, string? level, string? search, string? method) =>
{ // эндпоинт для просмотра логов
    var query = dbContext.Logs.AsQueryable();

    if (!string.IsNullOrEmpty(level))
        query = query.Where(l => l.Level == level);
        //фильрует по уровню, http методу, по запросу
    if (!string.IsNullOrEmpty(method))
        query = query.Where(m => m.MethodHttp == method);
    if (!string.IsNullOrEmpty(search))
        query = query.Where(l => l.Message.Contains(search) || (l.MethodHttp != null && l.MethodHttp.Contains(search)) || (l.Exception != null && l.Exception.Contains(search)));

    return query.OrderByDescending(l => l.Timestamp).ToList();
});

app.MapGet("/", () => "Рабочие эндпоинты: /comments, /logs");

app.Run();
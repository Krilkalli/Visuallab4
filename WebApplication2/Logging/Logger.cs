//собственно логгер, который пишет сообщения в БД
using WebApplication2.Model;
using WebApplication2.Repositories;

namespace WebApplication2.Logging
{
    public class Logger : ILogger
    {
        private readonly string _categoryName;
        private readonly IServiceProvider _serviceProvider;

        public Logger(string categoryName, IServiceProvider serviceProvider)
        {
            _categoryName = categoryName;
            _serviceProvider = serviceProvider;
        }

        public IDisposable BeginScope<TState>(TState state) => null;

        public bool IsEnabled(LogLevel logLevel) => logLevel != LogLevel.None;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var logContent = formatter(state, exception);
                var logRecord = new LogEntry
                {
                    Level = logLevel.ToString(),
                    Message = logContent.Length > 4000 ? logContent[..4000] : logContent,
                    Exception = exception?.ToString(),
                    MethodHttp = _categoryName.Length > 100 ? _categoryName[..100] : _categoryName,
                    Timestamp = DateTime.UtcNow
                };

                db.Logs.Add(logRecord);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to save log: {ex.Message}");
            }
        }
    }
}
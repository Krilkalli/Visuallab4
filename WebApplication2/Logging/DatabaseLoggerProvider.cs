//Поставщик логгеров
namespace WebApplication2.Logging;

public class DatabaseLoggerProvider : ILoggerProvider //этот класс отвечает за создание экземпляров логгеров
{
    private readonly IServiceProvider _serviceProvider;

    public DatabaseLoggerProvider(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public ILogger CreateLogger(string categoryName)
    {
        return new Logger(categoryName, _serviceProvider);
    }

    public void Dispose() { }
}
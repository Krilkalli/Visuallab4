using WebApplication2.Model;
using WebApplication2.Repositories;

namespace WebApplication2.Services;

public class CommentService //сервис вызывает репозиторий, делегирует операции репозиторию
{
    private ICommentRepository _repository; //зависимость об абстракции

    public CommentService(ICommentRepository repository) //Внедрение зависимости через конструктор (DIP + DI)
    {
        _repository = repository;
    }
    public IEnumerable<Comment> GetAll() => _repository.GetAll();
    public Comment GetById(int id) => _repository.GetById(id);
    public Comment Add(Comment comment) => _repository.Add(comment);
    public Comment Update(int id, Comment comment) => _repository.Update(id, comment);
    public void Delete(int id) => _repository.Delete(id);
}

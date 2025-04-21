using WebApplication2.Model;
using WebApplication2.Repositories;

namespace WebApplication2.Services;

public class CommentService
{
    private ICommentRepository _repository;

    public CommentService(ICommentRepository repository)
    {
        _repository = repository;
    }
    public IEnumerable<Comment> GetAll() => _repository.GetAll();
    public Comment GetById(int id) => _repository.GetById(id);
    public Comment Add(Comment comment) => _repository.Add(comment);
    public Comment Update(int id, Comment comment) => _repository.Update(id, comment);
    public void Delete(int id) => _repository.Delete(id);
}

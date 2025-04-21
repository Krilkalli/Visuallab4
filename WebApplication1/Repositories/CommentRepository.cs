using WebApplication2.Model;

namespace WebApplication2.Repositories;

public class CommentRepository : ICommentRepository 
{
    private Dictionary<int, Comment> _comments= new Dictionary<int, Comment>();
    private int _nextId = 1;
    
    public IEnumerable<Comment> GetAll()
    {
        return _comments.Values;
    }

    public Comment GetById(int id)
    {
        return _comments.GetValueOrDefault(id);
    }
    public Comment Add(Comment comment)
    {
        comment.Id = _nextId++;
        _comments[comment.Id] = comment;
        return comment;
    }
    public Comment Update(int id, Comment comment)
    {
        if (!_comments.ContainsKey(id)) return null;

        comment.Id = id; 
        _comments[id] = comment;
        return comment;
    }

    public void Delete(int id)
    {
        _comments.Remove(id);
    }
}

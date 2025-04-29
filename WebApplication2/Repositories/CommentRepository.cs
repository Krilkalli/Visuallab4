using WebApplication2.Model;

namespace WebApplication2.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly AppDbContext _db;

    public CommentRepository(AppDbContext db)
    {
        _db = db;
        _db.Database.EnsureCreated();//создает базу данных, если её нет
    }

    public IEnumerable<Comment> GetAll() => _db.Comments.ToList();

    public Comment GetById(int id) => _db.Comments.Find(id);

    public Comment Add(Comment comment)
    {
        _db.Comments.Add(comment);
        _db.SaveChanges();
        return comment;
    }

    public Comment Update(int id, Comment comment)
    {
        var existingComment = _db.Comments.Find(id);
        if (existingComment == null) return null;

        existingComment.Name = comment.Name;
        existingComment.Email = comment.Email;
        existingComment.Body = comment.Body;
        existingComment.PostId = comment.PostId;

        _db.SaveChanges();
        return existingComment;
    }

    public void Delete(int id)
    {
        var comment = _db.Comments.Find(id);
        if (comment != null)
        {
            _db.Comments.Remove(comment);
            _db.SaveChanges();
        }
    }
}
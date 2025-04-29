using WebApplication2.Model;

namespace WebApplication2.Repositories;

public interface ICommentRepository //описывает методы
{
    IEnumerable<Comment> GetAll();      
    Comment GetById(int id);            
    Comment Add(Comment comment);      
    Comment Update(int id, Comment comment); 
    void Delete(int id);
}

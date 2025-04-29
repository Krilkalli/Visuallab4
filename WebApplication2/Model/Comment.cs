namespace WebApplication2.Model;

public class Comment
{
    private int _id;
    private string _name;
    private string _email;
    private string _body;
    private int _postId;

    public int Id 
    { 
        get => _id; 
        set => _id = value; 
    }
    public string Name 
    { 
        get => _name; 
        set => _name = value ?? throw new ArgumentNullException(nameof(value)); 
    }
    public string Email
    {
        get => _email;
        set => _email = value ?? throw new ArgumentNullException(nameof(value));
    }
    public string Body 
    { 
        get => _body; 
        set => _body = value ?? throw new ArgumentNullException(nameof(value)); 
    }
    public int PostId 
    { 
        get => _postId; 
        set => _postId = value; 
    }
}

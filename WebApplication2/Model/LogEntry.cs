//модель для хранения записей логов
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Model
{
    [Table("Logs")]
    public class LogEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [Column("Timestamp")]
        public DateTime Timestamp { get; set; }

        [Required]
        [Column("Level")]
        public string Level { get; set; } = null!;

        [Required]
        [Column("Message")]
        public string Message { get; set; } = null!;

        [Column("Exception")]
        public string? Exception { get; set; }

        [Column("MethodHTTP")]
        public string? MethodHttp { get; set; }  
    }
}
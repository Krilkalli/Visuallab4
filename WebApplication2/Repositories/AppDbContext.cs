//контекст БД с конфигурацией таблицы логов
using Microsoft.EntityFrameworkCore;
using WebApplication2.Model;

namespace WebApplication2.Repositories
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<LogEntry> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LogEntry>(entity =>
            {
                entity.ToTable("Logs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd().UseIdentityAlwaysColumn(); 
                entity.Property(e => e.Timestamp).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.Level).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.MethodHttp).HasColumnName("MethodHTTP");  
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
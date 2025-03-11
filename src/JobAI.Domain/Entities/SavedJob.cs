using JobAI.Domain.Common;

namespace JobAI.Domain.Entities;

public class SavedJob : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public Guid JobId { get; set; }
    public virtual Job Job { get; set; } = null!;
    
    public string? Notes { get; set; }
}


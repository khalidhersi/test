using JobAI.Domain.Common;

namespace JobAI.Domain.Entities;

public class JobSkill : BaseEntity
{
    public Guid JobId { get; set; }
    public virtual Job Job { get; set; } = null!;
    
    public Guid SkillId { get; set; }
    public virtual Skill Skill { get; set; } = null!;
    
    public bool IsRequired { get; set; } = true;
    public int? MinimumYearsRequired { get; set; }
}


using JobAI.Domain.Common;

namespace JobAI.Domain.Entities;

public class UserSkill : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public Guid SkillId { get; set; }
    public virtual Skill Skill { get; set; } = null!;
    
    public int? YearsOfExperience { get; set; }
    public int? ProficiencyLevel { get; set; } // 1-5 scale
}


namespace JobAI.Application.Common.Interfaces;

public interface IResumeParserService
{
    Task<ResumeParseResult> ParseResumeAsync(byte[] fileData, string fileName);
}

public class ResumeParseResult
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
    public string? Summary { get; set; }
    public List<string> Skills { get; set; } = new List<string>();
    public List<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
    public List<Education> Educations { get; set; } = new List<Education>();
}

public class WorkExperience
{
    public string? Company { get; set; }
    public string? Position { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Description { get; set; }
}

public class Education
{
    public string? Institution { get; set; }
    public string? Degree { get; set; }
    public string? FieldOfStudy { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}


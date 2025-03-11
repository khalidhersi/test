namespace JobAI.Application.Common.Interfaces;

public interface IAIService
{
    Task<string> GenerateCoverLetterAsync(string jobDescription, string userProfile);
    Task<SkillsAnalysisResult> AnalyzeSkillsMatchAsync(string jobDescription, List<string> userSkills);
    Task<SalaryAnalysisResult> AnalyzeSalaryAsync(string jobDescription, string currentSalary, string expectedSalaryRange);
    Task<List<string>> RecommendSkillsAsync(List<string> userSkills, string jobTitle);
}

public class SkillsAnalysisResult
{
    public List<string> MatchingSkills { get; set; } = new List<string>();
    public List<string> MissingSkills { get; set; } = new List<string>();
    public List<string> Recommendations { get; set; } = new List<string>();
    public int RelevanceScore { get; set; }
}

public class SalaryAnalysisResult
{
    public string RecommendedRange { get; set; } = string.Empty;
    public string MarketContext { get; set; } = string.Empty;
    public List<string> Factors { get; set; } = new List<string>();
}


namespace JobAI.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
    Task SendEmailWithTemplateAsync(string to, string templateName, object model);
}


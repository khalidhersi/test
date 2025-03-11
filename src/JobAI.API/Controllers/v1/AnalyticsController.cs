using JobAI.Application.Analytics.Queries.GetApplicationMetrics;
using JobAI.Application.Analytics.Queries.GetSuccessRate;
using JobAI.Application.Analytics.Queries.GetTimelineActivity;
using JobAI.Application.Analytics.Queries.GetTopCompanies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAI.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("application-metrics")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApplicationMetricsDto>> GetApplicationMetrics([FromQuery] GetApplicationMetricsQuery query)
    {
        var metrics = await _mediator.Send(query);
        return Ok(metrics);
    }

    [HttpGet("success-rate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<SuccessRateDto>> GetSuccessRate()
    {
        var successRate = await _mediator.Send(new GetSuccessRateQuery());
        return Ok(successRate);
    }

    [HttpGet("timeline-activity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TimelineActivityDto>>> GetTimelineActivity([FromQuery] GetTimelineActivityQuery query)
    {
        var activity = await _mediator.Send(query);
        return Ok(activity);
    }

    [HttpGet("top-companies")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TopCompanyDto>>> GetTopCompanies()
    {
        var companies = await _mediator.Send(new GetTopCompaniesQuery());
        return Ok(companies);
    }
}


using JobAI.Application.Jobs.Commands.CreateJob;
using JobAI.Application.Jobs.Commands.UpdateJob;
using JobAI.Application.Jobs.Queries.GetJobById;
using JobAI.Application.Jobs.Queries.SearchJobs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAI.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IMediator _mediator;

    public JobsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<SearchJobsResult>> Search([FromQuery] SearchJobsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<JobDto>> GetById(Guid id)
    {
        var job = await _mediator.Send(new GetJobByIdQuery { Id = id });
        return Ok(job);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Employer")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Guid>> Create(CreateJobCommand command)
    {
        var jobId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = jobId }, jobId);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Employer")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateJobCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await _mediator.Send(command);
        return NoContent();
    }
}


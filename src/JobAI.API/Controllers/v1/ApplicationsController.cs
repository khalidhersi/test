using JobAI.Application.Applications.Commands.CreateApplication;
using JobAI.Application.Applications.Commands.UpdateApplicationStatus;
using JobAI.Application.Applications.Queries.GetApplicationById;
using JobAI.Application.Applications.Queries.GetUserApplications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAI.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ApplicationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ApplicationDto>>> GetUserApplications([FromQuery] GetUserApplicationsQuery query)
    {
        var applications = await _mediator.Send(query);
        return Ok(applications);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApplicationDetailDto>> GetById(Guid id)
    {
        var application = await _mediator.Send(new GetApplicationByIdQuery { Id = id });
        return Ok(application);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Guid>> Create(CreateApplicationCommand command)
    {
        var applicationId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = applicationId }, applicationId);
    }

    [HttpPut("{id}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid id, UpdateApplicationStatusCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await _mediator.Send(command);
        return NoContent();
    }
}


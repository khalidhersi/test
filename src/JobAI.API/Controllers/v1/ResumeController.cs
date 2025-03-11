using JobAI.Application.Resumes.Commands.UploadResume;
using JobAI.Application.Resumes.Queries.GetResumeById;
using JobAI.Application.Resumes.Queries.GetUserResumes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAI.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class ResumeController : ControllerBase
{
    private readonly IMediator _mediator;

    public ResumeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ResumeDto>>> GetUserResumes()
    {
        var resumes = await _mediator.Send(new GetUserResumesQuery());
        return Ok(resumes);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ResumeDto>> GetById(Guid id)
    {
        var resume = await _mediator.Send(new GetResumeByIdQuery { Id = id });
        return Ok(resume);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Guid>> Upload([FromForm] UploadResumeCommand command)
    {
        var resumeId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = resumeId }, resumeId);
    }
}


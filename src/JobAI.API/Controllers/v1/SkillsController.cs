using JobAI.Application.Skills.Commands.AddSkill;
using JobAI.Application.Skills.Commands.RemoveSkill;
using JobAI.Application.Skills.Queries.GetRecommendedSkills;
using JobAI.Application.Skills.Queries.GetUserSkills;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAI.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class SkillsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SkillsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SkillDto>>> GetUserSkills()
    {
        var skills = await _mediator.Send(new GetUserSkillsQuery());
        return Ok(skills);
    }

    [HttpGet("recommended")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SkillDto>>> GetRecommendedSkills()
    {
        var skills = await _mediator.Send(new GetRecommendedSkillsQuery());
        return Ok(skills);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddSkill(AddSkillCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveSkill(Guid id)
    {
        await _mediator.Send(new RemoveSkillCommand { Id = id });
        return NoContent();
    }
}


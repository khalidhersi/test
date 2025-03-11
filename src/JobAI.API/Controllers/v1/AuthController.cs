using JobAI.Application.Auth.Commands.Login;
using JobAI.Application.Auth.Commands.RefreshToken;
using JobAI.Application.Auth.Commands.Register;
using JobAI.Application.Auth.Commands.SetupTwoFactor;
using JobAI.Application.Auth.Commands.VerifyTwoFactor;
using JobAI.Application.Auth.Commands.DisableTwoFactor;
using JobAI.Application.Auth.Queries.GetTwoFactorStatus;
using JobAI.Application.Auth.Commands.GenerateRecoveryCodes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAI.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginCommand command)
    {
        var result = await _mediator.Send(command);
        
        // If 2FA is required, return a special response
        if (result.RequiresTwoFactor)
        {
            return Ok(new { requiresTwoFactor = true, temporaryToken = result.TemporaryToken });
        }
        
        return Ok(result);
    }

    [HttpPost("two-factor/verify")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> VerifyTwoFactor(VerifyTwoFactorCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("two-factor/setup")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<TwoFactorSetupResponseDto>> SetupTwoFactor()
    {
        var result = await _mediator.Send(new SetupTwoFactorCommand());
        return Ok(result);
    }

    [HttpPost("two-factor/confirm-setup")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<bool>> ConfirmTwoFactorSetup(ConfirmTwoFactorSetupCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("two-factor/disable")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<bool>> DisableTwoFactor(DisableTwoFactorCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("two-factor/status")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<TwoFactorStatusDto>> GetTwoFactorStatus()
    {
        var result = await _mediator.Send(new GetTwoFactorStatusQuery());
        return Ok(result);
    }

    [HttpPost("two-factor/recovery-codes")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<RecoveryCodesDto>> GenerateRecoveryCodes()
    {
        var result = await _mediator.Send(new GenerateRecoveryCodesCommand());
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken(RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        // Implement logout logic if needed
        return NoContent();
    }
}


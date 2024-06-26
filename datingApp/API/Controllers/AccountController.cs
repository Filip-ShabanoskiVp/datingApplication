
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;

        public AccountController(UserManager<AppUser> UserManager,SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            userManager = UserManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
            this.mapper = mapper;
        }

       [HttpPost("register")]
       public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
       {

        if(await UserExists(registerDto.Username))
        {
            return BadRequest("Username is taken");
        }

        var user = mapper.Map<AppUser>(registerDto);

        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if(!result.Succeeded) return BadRequest(result.Errors);

        var roleResult = await userManager.AddToRoleAsync(user, "Member");

        if(!roleResult.Succeeded) return BadRequest(roleResult.Errors);

        

        return new UserDto 
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
       }

       [HttpPost("login")]
       public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
       {
        var user = await userManager.Users
                    .Include(p=>p.Photos)
                    .SingleOrDefaultAsync(u=>u.UserName==loginDto.Username.ToLower());

        if(user==null) return Unauthorized("Invalid username");

        var result = await signInManager
        .CheckPasswordSignInAsync(user, loginDto.Password,false);

        if(!result.Succeeded) return Unauthorized();

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x =>x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
       } 

       private async Task<bool> UserExists(string username)
       {
        return await userManager.Users.AnyAsync(x => x.UserName==username.ToLower());
       }
    }
}
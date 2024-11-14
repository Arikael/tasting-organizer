using System.ComponentModel.DataAnnotations;

namespace TastingOrganizer.WebApi.Dtos;

public class CreateTastingDto
{
    [Required]
    [MaxLength(1)]
    public string Title { get; set; } = "";
}
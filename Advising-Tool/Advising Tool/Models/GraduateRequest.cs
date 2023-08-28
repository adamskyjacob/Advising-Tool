
namespace Advising_Tool.Models
{
    public class GraduateRequest
    {
        public string? AREA
        {
            get; set;
        }
        public string? TYPE
        {
            get; set;
        }
        public override string ToString()
        {
            return "Area: " + AREA! + ", Type: " + TYPE!;
        }
    }
}


namespace Advising_Tool.Models
{
    public class UndergraduateRequest
    {
        public string? AREA
        {
            get; set;
        }
        public string? TYPE
        {
            get; set;
        }
        public string? NAME
        {
            get; set;
        }
        public override string ToString()
        {
            return "Area: " + AREA! + ", Type: " + TYPE! + ", Name: " + NAME!;
        }
    }
}

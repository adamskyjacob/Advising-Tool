
namespace Advising_Tool.Models
{
    public class Course
    {
        public string? AREA
        {
            get; set;
        }
        public string? ID
        {
            get; set;
        }
        public string? DESCRIPTION
        {
            get; set;
        }
        public string? NAME
        {
            get; set;
        }
        public string? CREDITS
        {
            get; set;
        }
        public string? PREREQ
        {
            get; set;
        }
        public string? REC
        {
            get; set;
        }
        public string? WAIVE
        {
            get; set;
        }
        public string? CRANGE
        {
            get; set;
        }
        public string? WAIVELINK
        {
            get; set;
        }
        public override string ToString()
        {
            return AREA + ", " + ID + ", " + DESCRIPTION + ", " + NAME + ", " + CREDITS + ", " + PREREQ;
        }
    }
}

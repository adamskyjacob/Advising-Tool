namespace Advising_Tool
{
    public static class Utils
    {
        public const string ConnectionString = "server=adamskyadvising.mysql.database.azure.com,3306;database=advising;user=adamskyadvising;password=Password123!;pooling=false;";
        public static List<string> Humanities = new() { "AR", "EN", "TH", "MU", "AB", "CN", "GN", "SP", "WR", "HI", "HU", "INTL", "PY", "RE" };
    }
}

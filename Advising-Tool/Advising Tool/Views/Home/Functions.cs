using Advising_Tool.Models;
using MySql.Data.MySqlClient;
using System.Text.Json;

namespace Advising_Tool.Views.Home
{
    public static class Functions
    {
        public static bool intBetween(int val, int lower, int upper)
        {
            return val >= lower && val <= upper;
        }
        public static double CalculateFraction(string val)
        {
            if (val.Contains('/'))
            {
                string[] split = val.Split('/');
                return int.Parse(split[0]) / int.Parse(split[1]);
            }
            else if (val.Contains('-'))
            {
                string[] split = val.Split('-');
                return int.Parse(split[0]) / int.Parse(split[1]);
            }
            else if (int.TryParse(val, out int ret))
            {
                return ret;
            }
            return 0;
        }
        public static T ParseJson<T>(string str)
        {
            return JsonSerializer.Deserialize<T>(str)!;
        }
        public static TripleEnumerable<string, string, string> GetUndergraduateOptions()
        {
            TripleEnumerable<string, string, string> retList = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT AREA, LONGNAME, DEGREE FROM ugareas");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        retList.Add(sdr["AREA"].ToString()!, sdr["DEGREE"].ToString()!, sdr["LONGNAME"].ToString()!);
                    }
                }
                con.Close();
            }
            return retList;
        }
        public static TripleEnumerable<string, string, string> GetGraduateOptions()
        {
            TripleEnumerable<string, string, string> retList = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT AREA, LONGNAME, DEGREE FROM areas");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        retList.Add(sdr["AREA"].ToString()!, sdr["DEGREE"].ToString()!, sdr["LONGNAME"].ToString()!);
                    }
                }
                con.Close();
            }
            return retList;
        }
        public static void AddUGCourseFunc(Course course)
        {
            using MySqlConnection conn = new(Utils.ConnectionString);
            conn.Open();
            try
            {
                MySqlCommand comm = conn.CreateCommand();
                comm.CommandText = "INSERT INTO ugcatalog (AREA, ID, NAME, DESCRIPTION, CREDIT, PREREQ, REC, WAIVE, WAIVELINK, CRANGE) VALUES (?AREA, ?ID, ?NAME, ?DESCRIPTION, ?CREDIT, ?PREREQ, ?REC, ?WAIVE, ?WAIVELINK, ?CRANGE)";
                comm.Connection = conn;
                comm.Parameters.AddWithValue("?AREA", course.AREA);
                comm.Parameters.AddWithValue("?ID", course.ID);
                comm.Parameters.AddWithValue("?NAME", course.NAME);
                comm.Parameters.AddWithValue("?DESCRIPTION", course.DESCRIPTION);
                comm.Parameters.AddWithValue("?CREDIT", course.CREDITS);
                comm.Parameters.AddWithValue("?REC", course.REC);
                comm.Parameters.AddWithValue("?PREREQ", course.PREREQ);
                comm.Parameters.AddWithValue("?WAIVE", course.WAIVE);
                comm.Parameters.AddWithValue("?WAIVELINK", course.WAIVELINK);
                comm.Parameters.AddWithValue("?CRANGE", course.CRANGE);
                comm.ExecuteNonQuery();
            }
            catch (MySqlException err)
            {
                Console.WriteLine(err.ToString());
                throw err;
            }
            finally
            {
                conn.Dispose();
                conn.Close();
            }
        }
        public static void AddCourseFunc(Course course)
        {
            using MySqlConnection conn = new(Utils.ConnectionString);
            conn.Open();
            MySqlCommand comm = conn.CreateCommand();
            comm.CommandText = "INSERT INTO catalog (AREA, ID, NAME, DESCRIPTION, CREDIT, PREREQ, REC, WAIVE, WAIVELINK, CRANGE) VALUES (?AREA, ?ID, ?NAME, ?DESCRIPTION, ?CREDIT, ?PREREQ, ?REC, ?WAIVE, ?WAIVELINK, ?CRANGE)";
            comm.Connection = conn;
            comm.Parameters.AddWithValue("?AREA", course.AREA);
            comm.Parameters.AddWithValue("?ID", course.ID);
            comm.Parameters.AddWithValue("?NAME", course.NAME);
            comm.Parameters.AddWithValue("?DESCRIPTION", course.DESCRIPTION);
            comm.Parameters.AddWithValue("?CREDIT", course.CREDITS);
            comm.Parameters.AddWithValue("?REC", course.REC);
            comm.Parameters.AddWithValue("?PREREQ", course.PREREQ);
            comm.Parameters.AddWithValue("?WAIVE", course.WAIVE);
            comm.Parameters.AddWithValue("?WAIVELINK", course.WAIVELINK);
            comm.Parameters.AddWithValue("?CRANGE", course.CRANGE);
            try
            {
                comm.ExecuteNonQuery();
            }
            catch (MySqlException err)
            {
                Console.WriteLine(err.ToString());
                throw err;
            }
            finally
            {
                conn.Dispose();
                conn.Close();
            }
        }
        public static KeyValuePair<string, string> ParsePair(string val)
        {
            string val1, val2;
            string[] split = val.Replace("{", "").Replace("}", "").Replace("[", "").Replace("]", "").Split(":");
            val1 = split[0].Replace("{", null).Replace("\"", "").Replace(" ", "");
            val2 = split[1].Replace("}", null).Replace("\"", "");
            return new(val1, val2);
        }
        public static List<Course> GetUGCatalog()
        {
            List<Course> arr = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM ugcatalog");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        Course course = new()
                        {
                            AREA = sdr["AREA"].ToString(),
                            ID = sdr["ID"].ToString(),
                            DESCRIPTION = sdr["DESCRIPTION"].ToString(),
                            NAME = sdr["NAME"].ToString(),
                            CREDITS = sdr["CREDIT"].ToString(),
                            PREREQ = sdr["PREREQ"].ToString(),
                            REC = sdr["REC"].ToString(),
                            WAIVE = sdr["WAIVE"].ToString(),
                            CRANGE = sdr["CRANGE"].ToString(),
                            WAIVELINK = sdr["WAIVELINK"].ToString()
                        };
                        arr.Add(course);
                    }
                }
                con.Close();
            }
            return arr;
        }
        public static List<Course> GetCatalog()
        {
            List<Course> arr = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM catalog");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        Course course = new()
                        {
                            AREA = sdr["AREA"].ToString(),
                            ID = sdr["ID"].ToString(),
                            DESCRIPTION = sdr["DESCRIPTION"].ToString(),
                            NAME = sdr["NAME"].ToString(),
                            CREDITS = sdr["CREDIT"].ToString(),
                            PREREQ = sdr["PREREQ"].ToString(),
                            REC = sdr["REC"].ToString(),
                            WAIVE = sdr["WAIVE"].ToString(),
                            CRANGE = sdr["CRANGE"].ToString(),
                            WAIVELINK = sdr["WAIVELINK"].ToString()
                        };
                        arr.Add(course);
                    }
                }
                con.Close();
            }
            return arr;
        }
        public static string GetYGCourseName(string area, string id)
        {
            string retValue = "";
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM ugcatalog WHERE AREA='" + area + "' AND ID='" + id + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        retValue = sdr["NAME"].ToString()!;
                    }
                }
                con.Close();
            }
            return retValue;
        }
        public static Course GetUGCourseInfo(string area, string id)
        {
            Course retValue = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM ugcatalog WHERE AREA='" + area + "' AND ID='" + id + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        retValue = new()
                        {
                            AREA = sdr["AREA"].ToString(),
                            ID = sdr["ID"].ToString(),
                            DESCRIPTION = sdr["DESCRIPTION"].ToString(),
                            NAME = sdr["NAME"].ToString(),
                            CREDITS = sdr["CREDIT"].ToString(),
                            PREREQ = sdr["PREREQ"].ToString(),
                            REC = sdr["REC"].ToString(),
                            WAIVE = sdr["WAIVE"].ToString(),
                            CRANGE = sdr["CRANGE"].ToString(),
                            WAIVELINK = sdr["WAIVELINK"].ToString()
                        };
                    }
                }
                con.Close();
            }
            return retValue;
        }
        public static Course GetCourseInfo(string area, string id)
        {
            Course retValue = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM catalog WHERE AREA='" + area + "' AND ID='" + id + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        retValue = new()
                        {
                            AREA = sdr["AREA"].ToString(),
                            ID = sdr["ID"].ToString(),
                            DESCRIPTION = sdr["DESCRIPTION"].ToString(),
                            NAME = sdr["NAME"].ToString(),
                            CREDITS = sdr["CREDIT"].ToString(),
                            PREREQ = sdr["PREREQ"].ToString(),
                            REC = sdr["REC"].ToString(),
                            WAIVE = sdr["WAIVE"].ToString(),
                            CRANGE = sdr["CRANGE"].ToString(),
                            WAIVELINK = sdr["WAIVELINK"].ToString()
                        };
                    }
                }
                con.Close();
            }
            return retValue;
        }
        public static JsonElement GetSectionalCourses(string area, string section)
        {
            JsonElement retValue = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM sectional WHERE AREA='" + area + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        JsonElement val = JsonSerializer.Deserialize<JsonElement>(sdr["SECTIONS"].ToString()!);
                        foreach (JsonElement obj in val.EnumerateArray())
                        {
                            if (obj.GetProperty("SECTION").ToString() == section)
                            {
                                retValue = obj;
                                break;
                            }
                        }
                    }
                }
                con.Close();
            }
            return retValue;
        }
        public static string GetStudyAreaName(string query)
        {
            string retString = "";
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM studyarea WHERE studyarea='" + query + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        retString = sdr["longname"].ToString()!;
                    }
                }
                con.Close();
            }
            return retString;
        }
        public static Dictionary<string, string> GetStudyAreas()
        {
            Dictionary<string, string> ret = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM studyarea;");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        ret.Add(sdr["studyarea"].ToString()!, sdr["longname"].ToString()!);
                    }
                }
                con.Close();
            }
            return ret;
        }
    }
}

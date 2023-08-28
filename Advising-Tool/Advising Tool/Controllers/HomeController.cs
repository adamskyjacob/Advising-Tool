using Advising_Tool.Models;
using Advising_Tool.Views.Home;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Diagnostics;

namespace Advising_Tool.Controllers
{
    public class HomeController : Controller
    {
        [Route("/Add-UGSheet-Redirect")]
        public IActionResult AddUndergraduateSheetRedirect(UndergraduateSchedule schedule)
        {
            using MySqlConnection conn = new(Utils.ConnectionString);
            conn.Open();
            MySqlCommand comm = conn.CreateCommand();
            comm.CommandText = "INSERT INTO ugareas (AREA, DEGREE, COURSES, FINAL, ELECTIVE, DEPTH, NOTES, LONGNAME, FOCUSELECT, SPECIALTY, REQUIRED) VALUES (?AREA, ?DEGREE, ?COURSES, ?FINAL, ?ELECTIVE, ?DEPTH, ?NOTES, ?LONGNAME, ?FOCUS, ?SPECIALTY, ?REQUIRED)";
            comm.Connection = conn;
            comm.Parameters.AddWithValue("?AREA", (schedule.AREA == "") ? null : schedule.AREA);
            comm.Parameters.AddWithValue("?DEGREE", (schedule.DEGREE == "") ? null : schedule.DEGREE);
            comm.Parameters.AddWithValue("?COURSES", (schedule.COURSES == "") ? "" : schedule.COURSES);
            comm.Parameters.AddWithValue("?FINAL", (schedule.FINAL == "") ? "" : schedule.FINAL);
            comm.Parameters.AddWithValue("?ELECTIVE", (schedule.ELECTIVE == "") ? "" : schedule.ELECTIVE);
            comm.Parameters.AddWithValue("?DEPTH", (schedule.DEPTH == "") ? "" : schedule.DEPTH);
            comm.Parameters.AddWithValue("?NOTES", (schedule.NOTES == "") ? "" : "-If you elect to take an off-campus IQP, you must complete ID 2050 as a Social Science credit (ECON, ENV, GOV, etc.)" + schedule.NOTES);
            comm.Parameters.AddWithValue("?LONGNAME", (schedule.LONGNAME == "") ? "" : schedule.LONGNAME);
            comm.Parameters.AddWithValue("?SPECIALTY", (schedule.SPECIALTY == "") ? "" : schedule.SPECIALTY);
            comm.Parameters.AddWithValue("?FOCUS", (schedule.FOCUS == "") ? "" : schedule.FOCUS);
            comm.Parameters.AddWithValue("?REQUIRED", "[{\"NAME\": \"Interactive Qualifying Project\", \"CREDIT\": \"1\", \"COURSES\": [[{\"ID\": \"1\", \"AREA\": \"IQP\"}]], \"ELECTIVE\": []}, {\"NAME\": \"Major Qualifying Project\", \"CREDIT\": \"1\", \"COURSES\": [[{\"ID\": \"1\", \"AREA\": \"MQP\"}]], \"ELECTIVE\": []}, {\"NAME\": \"Humanities and Arts\", \"CREDIT\": \"1/3\", \"COURSES\": [[{\"ID\": \"3900\", \"AREA\": \"HU\"}, {\"ID\": \"3910\", \"AREA\": \"HU\"}]], \"ELECTIVE\": [{\"PICK\": 1, \"AREAS\": [\"AR\", \"EN\", \"TH\", \"MU\", \"AB\", \"CN\", \"GN\", \"SP\", \"WR\", \"HI\", \"HU\", \"INTL\", \"PY\", \"RE\"], \"CREDIT\": 3}]}]");
            comm.Connection = conn;
            try
            {
                comm.ExecuteNonQuery();
            }
            catch (MySqlException err)
            {
                Console.WriteLine(err.ToString());
                throw err;
            }
            conn.Dispose();
            conn.Close();
            return View();
        }

        [Route("/")]
        public IActionResult HomePageRedirect()
        {
            return View();
        }

        [Route("/Add-Sheet-Redirect")]
        public IActionResult AddGraduateSheetRedirect(GraduateSchedule schedule)
        {
            using MySqlConnection conn = new(Utils.ConnectionString);
            conn.Open();
            MySqlCommand comm = conn.CreateCommand();
            comm.CommandText = "INSERT INTO areas (AREA, DEGREE, COURSES, FINAL, ELECTIVE, DEPTH, NOTES, LONGNAME, FOCUSELECT, SPECIALTY) VALUES (?AREA, ?DEGREE, ?COURSES, ?FINAL, ?ELECTIVE, ?DEPTH, ?NOTES, ?LONGNAME, ?FOCUS, ?SPECIALTY)";
            comm.Connection = conn;
            comm.Parameters.AddWithValue("?AREA", (schedule.AREA == "") ? null : schedule.AREA);
            comm.Parameters.AddWithValue("?DEGREE", (schedule.DEGREE == "") ? null : schedule.DEGREE);
            comm.Parameters.AddWithValue("?COURSES", (schedule.COURSES == "") ? "" : schedule.COURSES);
            comm.Parameters.AddWithValue("?FINAL", (schedule.FINAL == "") ? "" : schedule.FINAL);
            comm.Parameters.AddWithValue("?ELECTIVE", (schedule.ELECTIVE == "") ? "" : schedule.ELECTIVE);
            comm.Parameters.AddWithValue("?DEPTH", (schedule.DEPTH == "") ? "" : schedule.DEPTH);
            comm.Parameters.AddWithValue("?NOTES", (schedule.NOTES == "") ? "" : schedule.NOTES);
            comm.Parameters.AddWithValue("?LONGNAME", (schedule.LONGNAME == "") ? "" : schedule.LONGNAME);
            comm.Parameters.AddWithValue("?SPECIALTY", (schedule.SPECIALTY == "") ? "" : schedule.SPECIALTY);
            comm.Parameters.AddWithValue("?FOCUS", (schedule.FOCUS == "") ? "" : schedule.FOCUS);
            comm.Connection = conn;
            try
            {
                comm.ExecuteNonQuery();
            }
            catch (MySqlException err)
            {
                Console.WriteLine(err.ToString());
                throw err;
            }
            conn.Dispose();
            conn.Close();
            return View();
        }
        [Route("/Add-UGCourse-Redirect")]
        public IActionResult AddUGCourseRedirect(Course course)
        {
            Functions.AddUGCourseFunc(course);
            return View(course);
        }
        [Route("/Add-Course-Redirect")]
        public IActionResult AddCourseRedirect(Course course)
        {
            Functions.AddCourseFunc(course);
            return View(course);
        }
        [Route("/Administration")]
        public IActionResult Administration()
        {
            return View(new Course());
        }
        [Route("/Add-Undergraduate-Sheet")]
        public IActionResult AddUndergraduateSheet()
        {
            return View(new UndergraduateSchedule());
        }
        [Route("/Modify-Undergraduate-Course")]
        public IActionResult ModifyUGCourse()
        {
            return View(new Course());
        }
        [Route("/UpdateUGCourse")]
        public IActionResult UpdateUGCourse(Course course) {
            using MySqlConnection conn = new(Utils.ConnectionString);
            conn.Open();
            MySqlCommand comm = conn.CreateCommand();
            comm.CommandText = $"UPDATE ugcatalog SET REC='{course.REC}' WHERE AREA='{course.AREA}' AND ID='{course.ID}';";
            comm.Connection = conn;
            try
            {
                comm.ExecuteNonQuery();
            }
            catch (MySqlException err)
            {
                Console.WriteLine(err.ToString());
                throw err;
            }
            conn.Dispose();
            conn.Close();
            return View();
        }
        [Route("/Help-Messages")]
        public IActionResult HelpMessages()
        {
            List<HelpMessage> messages = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM helpmessages");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        HelpMessage msg = new()
                        {
                            TIMESTAMP = sdr["timestamp"].ToString(),
                            MESSAGE = sdr["contents"].ToString(),
                            NAME = sdr["whoami"].ToString()
                        };
                        messages.Add(msg);
                    }
                    con.Close();
                }
            }
            return View(messages);
        }
        [Route("/Add-Graduate-Sheet")]
        public IActionResult AddGraduateSheet()
        {
            return View(new GraduateSchedule());
        }
        [Route("/Add-Graduate-Course")]
        public IActionResult AddGraduateCourse()
        {
            return View(new Course());
        }
        [Route("/Add-Undergraduate-Course")]
        public IActionResult AddUndergraduateCourse()
        {
            return View(new Course());
        }
        [Route("/General-Scheduling")]
        public IActionResult GeneralScheduling()
        {
            return View();
        }
        [Route("/Undergraduate-Catalog")]
        public IActionResult UndergraduateCatalogView()
        {
            return View();
        }
        [Route("/Graduate-Catalog")]
        public IActionResult GraduateCatalogView()
        {
            return View();
        }

        [Route("/Home")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("/Help")]
        public IActionResult Help()
        {
            return View(new HelpMessage());
        }
        [Route("/Message-Submission")]
        public IActionResult SubmitHelpMessage(HelpMessage Model)
        {
            using (MySqlConnection conn = new(Utils.ConnectionString))
            {
                conn.Open();
                try
                {
                    MySqlCommand comm = conn.CreateCommand();
                    comm.CommandText = "INSERT INTO helpmessages (timestamp, contents, whoami) VALUES (?time, ?msg, ?who)";
                    comm.Connection = conn;
                    comm.Parameters.AddWithValue("?time", Model.TIMESTAMP!);
                    comm.Parameters.AddWithValue("?msg", Model.MESSAGE!);
                    comm.Parameters.AddWithValue("?who", Model.NAME!);
                    comm.ExecuteNonQuery();
                }
                catch (MySqlException)
                {
                }
                finally
                {
                    conn.Dispose();
                    conn.Close();
                }
            }
            return View();
        }
        [Route("/Undergraduate-Scheduling")]
        public IActionResult UndergraduateScheduling()
        {
            return View(new UndergraduateRequest());
        }

        [Route("/Graduate-Scheduling")]
        public IActionResult GraduateScheduling()
        {
            return View(new GraduateRequest());
        }

        [Route("/Undergraduate-Schedule")]
        public IActionResult UndergraduateRequest(UndergraduateRequest req)
        {
            UndergraduateSchedule schedule = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM ugareas WHERE AREA='" + req.AREA!.Replace(" ", "") + "' AND DEGREE='" + req.TYPE!.Replace(" ", "") + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        schedule.AREA = sdr["AREA"].ToString()!;
                        schedule.DEGREE = sdr["DEGREE"].ToString()!;
                        schedule.LONGNAME = sdr["LONGNAME"].ToString()!;
                        schedule.COURSES = sdr["COURSES"].ToString()!;
                        schedule.ELECTIVE = sdr["ELECTIVE"].ToString()!;
                        schedule.FINAL = sdr["FINAL"].ToString()!;
                        schedule.FOCUS = sdr["FOCUSELECT"].ToString()!;
                        schedule.DEPTH = sdr["DEPTH"].ToString()!;
                        schedule.SPECIALTY = sdr["SPECIALTY"].ToString()!;
                        schedule.REQUIRED = sdr["REQUIRED"].ToString()!;
                        schedule.NOTES = sdr["NOTES"].ToString()!;
                    }
                }
                con.Close();
            }
            return View(schedule);
        }

        [Route("/Graduate-Schedule")]
        public IActionResult GraduateRequest(GraduateRequest req)
        {
            GraduateSchedule schedule = new();
            using (MySqlConnection con = new(Utils.ConnectionString))
            {
                using MySqlCommand cmd = new("SELECT * FROM areas WHERE AREA='" + req.AREA!.Replace(" ", "") + "' AND DEGREE='" + req.TYPE!.Replace(" ", "") + "'");
                cmd.Connection = con;
                con.Open();
                using (MySqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        schedule.AREA = sdr["AREA"].ToString()!;
                        schedule.LONGNAME = sdr["LONGNAME"].ToString()!;
                        schedule.DEGREE = sdr["DEGREE"].ToString()!;
                        schedule.COURSES = (sdr["COURSES"].ToString()! == "") ? "" : sdr["COURSES"].ToString()!;
                        schedule.FINAL = (sdr["FINAL"].ToString()! == "") ? "" : sdr["FINAL"].ToString()!;
                        schedule.ELECTIVE = (sdr["ELECTIVE"].ToString()! == "") ? "" : sdr["ELECTIVE"].ToString()!;
                        schedule.FOCUS = (sdr["FOCUSELECT"].ToString()! == "") ? "" : sdr["FOCUSELECT"].ToString()!;
                        schedule.DEPTH = (sdr["DEPTH"].ToString()! == "") ? "" : sdr["DEPTH"].ToString()!;
                        schedule.SPECIALTY = (sdr["SPECIALTY"].ToString()! == "") ? "" : sdr["SPECIALTY"].ToString()!;
                        schedule.NOTES = sdr["NOTES"].ToString()!;
                    }
                }
                con.Close();
            }
            return View(schedule);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Web;

namespace MyWebApp.Models
{
    public class Tajmer
    {
        private Timer timer { get; set; }

        public Tajmer()
        {
            timer = new Timer(60000);
            timer.Elapsed += OnTimedEvent;
            timer.AutoReset = true;
            timer.Enabled = true;
        }

        private static void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            MyFunction();
        }

        private static void MyFunction()
        {
            Console.WriteLine("Funkcija je pozvana u: " + DateTime.Now.ToString("HH:mm:ss"));
            // Ovde možete dodati bilo koju drugu logiku koju želite da izvršavate
            foreach(Let l in Letovi.LetoviList)
            {
                Letovi.UpdateStatusLeta(l);
            }
            //if (System.Web.HttpContext.Current.Session["User"] != null)
            //{
            //    User cUser = (User)System.Web.HttpContext.Current.Session["User"];
            //    if (cUser != null)
            //    {
            //        Users.UsersList = Users.ReadUsersFromJson();
            //        foreach (User u in Users.UsersList)
            //        {
            //            if (u.Username.Equals(cUser.Username) && u.Password.Equals(cUser.Password))
            //            {
            //                cUser = u;
            //            }
            //        }

            //        System.Web.HttpContext.Current.Session["User"] = cUser;

            //    }
            //}

        }
    }
}
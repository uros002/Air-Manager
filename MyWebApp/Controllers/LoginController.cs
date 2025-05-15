using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class LoginController : ApiController
    {
        [HttpGet]
        public User Get(string username, string password)
        {
            if(string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return null;
            }
            Users.UsersList = Users.ReadUsersFromJson();
            User user = Users.FindUser(username, password);
            if(user != null)
            {

                System.Web.HttpContext.Current.Session["User"] = user;
                //int brojac = (int)System.Web.HttpContext.Current.Application["brojacUser"];
                //brojac++;
                //System.Web.HttpContext.Current.Application["brojacUser"] = brojac;

                //System.Web.HttpContext.Current.Session[$"User{brojac}"] = user;

            }
            return user;

        }
    }
}

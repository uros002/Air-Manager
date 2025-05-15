using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class Users
    {
        //private static string baseDirectory = Environment.CurrentDirectory;
        //private static string relativePath = Path.Combine(baseDirectory, @"\..\Database\users.json");

        public static string filePathUsers = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\users.json";


        public static List<User> UsersList { get; set; } = ReadUsersFromJson();

        public Users()
        {
            UsersList = ReadUsersFromJson();
        }
        //new List<User>()
        //{
        //    new User()
        //    {
        //        Username = "user",
        //        Password = "user",
        //        Name = "test",
        //        Surname = "test",
        //        Email = "test@gmail.com",
        //        Type = UserType.Putnik,
        //        Rezervacije = new List<Rezervacija>()

        //    },
        //    new User()
        //    {
        //        Username = "admin",
        //        Password = "admin",
        //        Name = "test",
        //        Surname = "test",
        //        Email = "test@gmail.com",
        //        Type = UserType.Administrator,
        //        Rezervacije = new List<Rezervacija>()

        //    }

        //};
        

        public static User FindUser(string username,string password)
        {
            User retVal = null; 
            foreach(User u in UsersList)
            {
                if(u.Username.Equals(username) && u.Password.Equals(password))
                {
                    retVal = u;
                    break;
                }
            }

            return retVal;

           
        }

        public static List<User> FindUserForSearchName(string Name,string Surname)
        {
            List<User> retVal = new List<User>();
            if (string.IsNullOrEmpty(Name))
            {
                if (!string.IsNullOrEmpty(Surname))
                {
                    foreach (User l in UsersList)
                    {
                        if (l.Surname.ToLower().Contains(Surname.ToLower()))
                        {
                            retVal.Add(l);
                        }
                    }
                }
                else
                {
                    retVal = Users.UsersList;
                }
            }
            else if (string.IsNullOrEmpty(Surname))
            {
                foreach (User l in UsersList)
                {
                    if (l.Name.ToLower().Contains(Name.ToLower()))
                    {
                        retVal.Add(l);
                    }
                }
            }
            else
            {
                //List<Let> retVal = new List<Let>();
                foreach (User l in UsersList)
                {
                    if (l.Name.ToLower().Contains(Name.ToLower()) && l.Surname.ToLower().Contains(Surname.ToLower()))
                    {
                        retVal.Add(l);
                    }
                }
                //return retVal;
            }

            return retVal;
        }

        public static List<User> FindUserByDateInterval(List<User> lista, DateTime firstDate, DateTime seccondDate)
        {
            List<User> retVal = new List<User>();
            if (firstDate.Year == 1)
            {
                if (seccondDate.Year == 1)
                {
                    retVal = lista;
                }
                else
                {
                    foreach(User l in lista)
                    {
                        if (DateTime.Compare(l.DateOfBirth, seccondDate) <= 0)
                        {
                            retVal.Add(l);
                        }
                    }
                }

            }
            else if (seccondDate.Year == 1)
            {
                foreach(User l in lista)
                {
                    if (DateTime.Compare(l.DateOfBirth, firstDate) >= 0)
                    {
                        retVal.Add(l);
                    }
                }
            }
            else
            {


                foreach(User l in lista)
                {
                    if (DateTime.Compare(l.DateOfBirth, firstDate) >= 0 && DateTime.Compare(l.DateOfBirth, seccondDate) <= 0)
                    {
                        retVal.Add(l);
                    }
                }

            }
            return retVal;
        }


        public static List<User> ReadUsersFromJson()
        {
            string filePath = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\users.json";

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"The file {filePath} does not exist.");
            }

            string json = File.ReadAllText(filePath);
            List<User> users = JsonConvert.DeserializeObject<List<User>>(json);
            return users;
        }
    }


}
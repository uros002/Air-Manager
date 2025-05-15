using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{

    public enum UserType
    {
        Putnik,
        Administrator
    }

    public enum Genders
    {
        Male,
        Female,
        Other
    }
    public class User
    {
        public int ID { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }


        public string Name { get; set; }


        public string Surname { get; set; }

        public string Email { get; set; }


        public DateTime DateOfBirth { get; set; }


        public Genders Gender { get; set; }

        public UserType Type { get; set; }

        public List<Rezervacija> Rezervacije { get; set; }


        //public User(string username,string password,string name, string surname,string email,string birth, Genders g,UserType t)
        //{
        //    this.Username = username;
        //    this.Password = password;
        //    this.Name = name;
        //    this.Surname = surname;
        //    this.Email = email;
        //    this.DateOfBirth = birth;
        //    this.Gender = g;
        //    this.Type = t;
        //    Rezervacije = new List<Rezervacija>();
        //}

        public User()
        {
            Type = UserType.Putnik;
            Rezervacije = new List<Rezervacija>();
        }
    }
}
using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace MyWebApp.Controllers
{
    public class UsersController : ApiController
    {

        public static int Brojac { get; set; } 

        [HttpGet]
        [Route("api/users/profile")]
        public User Get()
        {
            User user = (User)System.Web.HttpContext.Current.Session["User"];
            Users.UsersList = Users.ReadUsersFromJson();
            foreach (User u in Users.UsersList)
            {
                if (u.Username.Equals(user.Username))
                {
                    System.Web.HttpContext.Current.Session["User"] = u;
                }
            }
            user = (User)System.Web.HttpContext.Current.Session["User"];

                return user;
           

        }


        [HttpGet]
        [Route("api/users/set")]
        public bool GetProbni(int brojac)
        {
            User user = (User)System.Web.HttpContext.Current.Session["User"];
            Users.UsersList = Users.ReadUsersFromJson();
            foreach (User u in Users.UsersList)
            {
                if (u.Username.Equals(user.Username))
                {
                    System.Web.HttpContext.Current.Session["User"] = u;
                }
            }
            user = (User)System.Web.HttpContext.Current.Session["User"];
            Brojac = brojac;
            return true;

        }

        [HttpGet]
        [Route("api/users/logout")]
        public User Logout()
        {

   //         int brojac = (int)System.Web.HttpContext.Current.Application["brojacUser"];
          //  brojac--;
          //  System.Web.HttpContext.Current.Application["brojacUser"] = brojac;

            

            System.Web.HttpContext.Current.Session[$"User"] = null;
                User user = (User)System.Web.HttpContext.Current.Session[$"User"];
                return user;
            
           
        }

        [HttpGet]
        [Route("api/users/all")]
        public List<User> GetAll()
        {
           
            return Users.UsersList;
        }

        [HttpGet]
        [Route("api/users/searchUsers")]
        public List<User> GetAll(string Name, string Surname, string FirstDate, string SeccondDate,int sort)
        {

            List<User> retVal = new List<User>();
            DateTime firstDateTime = new DateTime(1, 1, 1);
            DateTime seccondDateTime = new DateTime(1, 1, 1);
            if (!string.IsNullOrEmpty(FirstDate))
            {
                string[] date = FirstDate.Split('-');
                firstDateTime = new DateTime(Int32.Parse(date[0]), Int32.Parse(date[1]), Int32.Parse(date[2]));
            }
            if (!string.IsNullOrEmpty(SeccondDate))
            {
                string[] date = SeccondDate.Split('-');
                seccondDateTime = new DateTime(Int32.Parse(date[0]), Int32.Parse(date[1]), Int32.Parse(date[2]));
            }
            bool flag = false;
            if (Name != null && Surname != null && FirstDate != null && SeccondDate != null)
            {
                flag = true;
            }

            if (flag)
            {
                List<User> temp = Users.FindUserForSearchName(Name, Surname);

                List<User> temp2 = Users.FindUserByDateInterval(temp, firstDateTime, seccondDateTime);

                foreach (User l in temp2)
                {


                    retVal.Add(l);

                }
                return retVal;
            }
            else
            {
                // List<Let> temp = null;
                List<User> temp = Users.FindUserForSearchName(Name, Surname);

                List<User> temp2 = Users.FindUserByDateInterval(temp, firstDateTime, seccondDateTime);

                foreach (User l in temp2)
                {


                    retVal.Add(l);

                }


                if (sort == 0)
                {
                    retVal = retVal.OrderBy(r => r.Name).ToList();
                }
                else if (sort == 1)
                {
                    retVal = retVal.OrderByDescending(r => r.Name).ToList();
                }
                else if (sort == 2)
                {
                    retVal = retVal.OrderBy(r => r.DateOfBirth).ToList();
                }
                else if (sort == 3)
                {
                    retVal = retVal.OrderByDescending(r => r.DateOfBirth).ToList();
                }
                return retVal;
            }
        }

        [HttpPut]
        [Route("api/users/izmena")]
        public IHttpActionResult Izmena(User user)
        {
            if(string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Surname) || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Email) || user.DateOfBirth.Year == 1)
            {
                return BadRequest();
            }

            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];

            int index = Users.UsersList.FindIndex(u => u.ID.Equals(currentUser.ID));




            Users.UsersList[index].Name = user.Name;
            Users.UsersList[index].Surname = user.Surname;
            Users.UsersList[index].Email = user.Email;
            Users.UsersList[index].Username = user.Username;
            Users.UsersList[index].Password = user.Password;
            Users.UsersList[index].DateOfBirth = user.DateOfBirth;
            Users.UsersList[index].Gender = user.Gender;

            List<Int32> indexReview = new List<int>();
            foreach(Recenzija r in Letovi.RecenzijeList)
            {
                if (r.Recezent.ID.Equals(currentUser.ID))
                {
                    indexReview.Add(Letovi.RecenzijeList.IndexOf(r));
                }
            }
            
            foreach(int i in indexReview)
            {
                Letovi.RecenzijeList[i].Recezent = user;
            }


            List<Int32> indexRez = new List<int>();
            foreach (Rezervacija r in Letovi.RezervacijeList)
            {
                if (r.Korisnik.Equals(currentUser.Username))
                {
                    indexRez.Add(r.ID);
                }
            }

            foreach (int i in indexRez)
            {
                Letovi.RezervacijeList[i].Korisnik = user.Username;
            }


            foreach(Aviokompanija a in Letovi.AviokompanijeList)
            {
                a.Recenzije = Letovi.RecenzijeList.Where(r=> r.Aviokompanija.Equals(a.Name)).ToList();
            }


            Letovi.WriteListToJsonFile(Letovi.RecenzijeList, Letovi.filePathRecenzije);
            Letovi.WriteListToJsonFile(Letovi.RezervacijeList, Letovi.filePathRezervacije);
            Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);


            Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);

            

            System.Web.HttpContext.Current.Session["User"] = null;
            User us = (User)System.Web.HttpContext.Current.Session["User"];


            return Ok();

        }
            [HttpPut]
        [Route("api/users/put")]
        public IHttpActionResult Put([FromBody] PutRequest request)
        {
            int praviId = request.id;
            int brMesta = request.brMesta;


            // string username = ((User)System.Web.HttpContext.Current.Session["User"]).Username;
            //int praviId = Int32.Parse(id);
            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];
            //foreach(User u in Users.UsersList)
            //{
            //    if (u.Username.Equals(username))
            //    {
            //        currentUser = u;
            //    }
            //}

            Let let = Letovi.FindLetById(praviId);
            Letovi.UpdateStatusLeta(let);


            if (let != null && let.Status.Equals(StatusLeta.Aktivan))
            {


                Rezervacija rez = new Rezervacija() { Aviokompanija = let.Aviokompanija, ID = Letovi.GenerateId(), BrPutnika = brMesta, Let = let, Status = StatusReazervacije.Kreirana, UkupnaCena = PunaCena(let.Cena, brMesta), Korisnik = currentUser.Username };
                //let.BrSlobodnihMesta -= brMesta;
                currentUser.Rezervacije.Add(rez);
                int ind = -1;
                foreach(User u in Users.UsersList)
                {
                    if (u.Username.Equals(currentUser.Username))
                    {
                        ind = Users.UsersList.IndexOf(u);
                    }
                }
                if(ind != -1)
                {
                    Users.UsersList[ind] = currentUser;


                }
                else
                {
                    return BadRequest(); 
                }
                let.DoResevation(brMesta);
                Letovi.RezervacijeList.Add(rez);
                Letovi.WriteListToJsonFile(Letovi.RezervacijeList, Letovi.filePathRezervacije);

                Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);
                //let.Status = StatusLeta.Otkazan;
                //Console.WriteLine(let.Status);
                return StatusCode(HttpStatusCode.NoContent);

            }
            else
            {
                return BadRequest();
            }
        }

            [HttpPut]
            [Route("api/users/cancel")]
            public IHttpActionResult Cancel([FromBody] PutRequest request)
            {

                int idRezervacija = request.id;
                int brMesta = request.brMesta;

                // string username = ((User)System.Web.HttpContext.Current.Session["User"]).Username;

                User currentUser = (User)System.Web.HttpContext.Current.Session["User"];
                //foreach(User u in Users.UsersList)
                //{
                //    if (u.Username.Equals(username))
                //    {
                //        currentUser = u;
                //    }
                //}



                int index = -1;
                foreach (Rezervacija r in currentUser.Rezervacije)
                {
                    if (r.ID.Equals(idRezervacija))
                    {
                        index = currentUser.Rezervacije.IndexOf(r);
                    }
                }

                int index2 = -1;
                foreach (Rezervacija r in Letovi.RezervacijeList)
                {
                    if (r.ID.Equals(idRezervacija))
                    {
                        index2 = Letovi.RezervacijeList.IndexOf(r);
                    }
                }

                if (index != -1 && index2 != -1)
                {

                    Let let = Letovi.FindLetById(Letovi.RezervacijeList[index].Let.ID);

                if (Letovi.RezervacijeList[index2].Status.Equals(StatusReazervacije.Kreirana) || Letovi.RezervacijeList[index2].Status.Equals(StatusReazervacije.Odobrena))
                {
                    DateTime now = DateTime.Now;
                    if (DateTime.Compare(Letovi.RezervacijeList[index2].Let.DatumIVremePolaska, now) > 0)
                    {
                        TimeSpan diff = Letovi.RezervacijeList[index2].Let.DatumIVremePolaska - now;
                        if (diff.TotalHours > 24)
                        {
                            Letovi.RezervacijeList[index2].Status = StatusReazervacije.Otkazana;

                            currentUser.Rezervacije[index].Status = StatusReazervacije.Otkazana;

                            let.UndoResevation(brMesta);
                            return StatusCode(HttpStatusCode.NoContent);
                        }
                        else
                        {
                            return BadRequest();
                        }
                    }
                    else
                    {
                        return BadRequest();
                    }

                }else
                {
                    return BadRequest();
                }

                }
                else
                {
                    return BadRequest();
                }
            }
        


        [HttpPost]
        [Route("api/users/register/")]
        public IHttpActionResult Post(User user)
        {
            if(string.IsNullOrEmpty(user.Username)  || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Surname) || string.IsNullOrEmpty(user.Email) || user.DateOfBirth.Year == 1)
            {
                return BadRequest();
            }
            foreach(User u in Users.UsersList)
            {
                if (u.Username.Equals(user.Username))
                {
                    return BadRequest();
                }
            }
            Genders gender = Genders.Other;
            if (user.Gender.Equals("Male"))
            {
                gender = Genders.Male;
            }else if (user.Gender.Equals("Female"))
            {
                gender = Genders.Female;
            }

            User retVal = new User() { ID = Letovi.GenerateId(),Name = user.Name, Surname = user.Surname, Email = user.Email, Username = user.Username, Gender = user.Gender, Password = user.Password, DateOfBirth = user.DateOfBirth };
            Users.UsersList.Add(retVal);
            Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);
            System.Web.HttpContext.Current.Session["User"] = retVal;
            //int brojac = (int)System.Web.HttpContext.Current.Application["brojacUser"];
            //brojac++;
            //System.Web.HttpContext.Current.Application["brojacUser"] = brojac;

            //System.Web.HttpContext.Current.Session[$"User{brojac}"] = retVal;
            return Ok();
            
        }

        private double PunaCena(double cena, int brKarata)
        {
            return cena * brKarata;
        }
    }

    public class PutRequest
    {
        public int id { get; set; }
        public int brMesta { get; set; }

        
    }
}

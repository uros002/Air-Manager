using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class RezervacijaController : ApiController
    {

        [HttpGet]
        public List<Rezervacija> Get()
        {
           return Letovi.FindAllReservations();
        }


        [HttpGet]
        [Route("api/rezervacija/user")]
        public List<Rezervacija> UsersReservations()
        {

            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];
            Users.UsersList = Users.ReadUsersFromJson();
            foreach (User u in Users.UsersList)
            {
                if (u.Username.Equals(currentUser.Username))
                {
                    System.Web.HttpContext.Current.Session["User"] = u;
                }
            }
            

             currentUser = (User)System.Web.HttpContext.Current.Session["User"];
            return currentUser.Rezervacije;
        }
        

        [HttpGet]
        [Route("api/rezervacija/find/{id}")]
        public Rezervacija GetRezervacija(int id)
        {
            int index = -1;
            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];
            foreach (Rezervacija r in currentUser.Rezervacije)
            {
                if (r.Let.ID.Equals(id))
                {
                    index = currentUser.Rezervacije.IndexOf(r);
                }
            }

            if (index != -1)
            {
                return currentUser.Rezervacije.ElementAt(index);
            }
            else
            {
                return null;
            }
        }

        [HttpPut]
        [Route("api/rezervacija/accept/{id}")]
        public IHttpActionResult Put(int id)
        {
            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];
            int index = -1;
            foreach(Rezervacija r in Letovi.RezervacijeList)
            {
                if (r.ID.Equals(id))
                {
                    index = Letovi.RezervacijeList.IndexOf(r);
                    break;
                }
            }

            if(index != -1)
            {
               
                Letovi.RezervacijeList.ElementAt(index).Status = StatusReazervacije.Odobrena;
                User user = null;
                foreach(User u in Users.UsersList)
                {
                    foreach(Rezervacija r in u.Rezervacije)
                    {
                        if (r.ID.Equals(id))
                        {
                            user = u;
                        }
                    }
                }
               // int indexUser = Users.UsersList.FindIndex(u => u.ID.Equals(currentUser.ID));
               int indexRez = user.Rezervacije.FindIndex(r => r.ID.Equals(id));
                
                user.Rezervacije[indexRez].Status = StatusReazervacije.Odobrena;
                Letovi.WriteListToJsonFile(Letovi.RezervacijeList,Letovi.filePathRezervacije);
                Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);
                return Ok();

            }
            else
            {
               return BadRequest();
            }
        }


        [HttpPut]
        [Route("api/rezervacija/decline/{id}")]
        public IHttpActionResult Decline(int id)
        {
            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];
            int index = -1;
            foreach (Rezervacija r in Letovi.RezervacijeList)
            {
                if (r.ID.Equals(id))
                {
                    index = Letovi.RezervacijeList.IndexOf(r);
                    break;
                }
            }
            int letIndex = -1;

            foreach(Let l in Letovi.LetoviList)
            {
                if (l.ID.Equals(Letovi.RezervacijeList.ElementAt(index).Let.ID))
                {
                    letIndex = Letovi.LetoviList.IndexOf(l);
                }
            }

            if (index != -1)
            {
                Letovi.LetoviList.ElementAt(letIndex).UndoResevation(Letovi.RezervacijeList.ElementAt(index).BrPutnika);
                
                Letovi.RezervacijeList.ElementAt(index).Status = StatusReazervacije.Otkazana;

                User user = null;
                foreach (User u in Users.UsersList)
                {
                    foreach (Rezervacija r in u.Rezervacije)
                    {
                        if (r.ID.Equals(id))
                        {
                            user = u;
                        }
                    }
                }
                // int indexUser = Users.UsersList.FindIndex(u => u.ID.Equals(currentUser.ID));
                int indexRez = user.Rezervacije.FindIndex(r => r.ID.Equals(id));

                user.Rezervacije[indexRez].Status = StatusReazervacije.Otkazana;

                //int indexUser = Users.UsersList.FindIndex(u => u.ID.Equals(currentUser.ID));
                //int indexRez = Users.UsersList[indexUser].Rezervacije.FindIndex(r => r.ID.Equals(id));
                //Users.UsersList[indexUser].Rezervacije[indexRez].Status = StatusReazervacije.Otkazana;


                Letovi.WriteListToJsonFile(Letovi.RezervacijeList, Letovi.filePathRezervacije);
                Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);
                return Ok();

            }
            else
            {
                return BadRequest();
            }
        }
    }
}

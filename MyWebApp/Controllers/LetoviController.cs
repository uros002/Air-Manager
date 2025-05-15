using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class LetoviController : ApiController
    {

        [HttpGet]
        [Route("api/letovi/users")]
        public List<Let> GetAllUserLetovi()
        {
            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];

            List<Let> retVal = new List<Let>();

            foreach(Let l in Letovi.LetoviList)
            {
                foreach(Rezervacija r in currentUser.Rezervacije)
                {
                    if (l.ID.Equals(r.Let.ID))
                    {
                        retVal.Add(l);
                    }
                }
            }
            return retVal;
        }

        [HttpGet]
        [Route("api/letovi/allAdmin")]
        public List<Let> GetAdmin(string departureLocation,string arrivalLocation, string departureDate)
        {
            List<Let> retVal = new List<Let>();
            DateTime departureDateTime = new DateTime(1, 1, 1);
            DateTime arrivalDateTime = new DateTime(1, 1, 1);
            if (!string.IsNullOrEmpty(departureDate))
            {
                string[] date = departureDate.Split('-');
                departureDateTime = new DateTime(Int32.Parse(date[0]), Int32.Parse(date[1]), Int32.Parse(date[2]));
            }
            bool flag = false;
            if (departureLocation != null && arrivalLocation != null && departureDate != null )
            {
                flag = true;
            }

            if (flag)
            {
                List<Let> temp = Letovi.FindByLocation(departureLocation, arrivalLocation);

                List<Let> temp2 = Letovi.LetoviList.Where(l => (l.DatumIVremePolaska.Year == departureDateTime.Year && l.DatumIVremePolaska.Month == departureDateTime.Month && l.DatumIVremePolaska.Day == departureDateTime.Day)).ToList();

                foreach (Let l in temp2)
                {
                    Letovi.UpdateStatusLeta(l);
                 //   if (!l.IsDeleted)
                   // {
                        retVal.Add(l);
                    //}
                }
                return retVal;
            }
            else
            {
                // List<Let> temp = null;
                List<Let> temp = Letovi.FindByLocation(departureLocation, arrivalLocation);
                List<Let> temp2 = null;
                if (!string.IsNullOrEmpty(departureDate))
                {

                     temp2 = Letovi.LetoviList.Where(l => (l.DatumIVremePolaska.Year == departureDateTime.Year && l.DatumIVremePolaska.Month == departureDateTime.Month && l.DatumIVremePolaska.Day == departureDateTime.Day)).ToList();
                }
                else
                {
                    temp2 = temp;
                }



                foreach (Let l in temp2)
                {
                    Letovi.UpdateStatusLeta(l);
              //      if (!l.IsDeleted)
                //    {
                        retVal.Add(l);
                  //  }
                }

            }
            return retVal;
        }


        [HttpGet]
        [Route("api/letovi/getLetovi")]
        public List<Let> Get(string departureLocation, string arrivalLocation, int numberOfPassengers, int sort, string departureDate,string arrivalDate)
        {
            User user = (User)System.Web.HttpContext.Current.Session["User"];
            List<Let> retVal = new List<Let>();
            //  Console.WriteLine(user.Username);
            DateTime departureDateTime = new DateTime(1,1,1);
            DateTime arrivalDateTime = new DateTime(1,1,1);
            if (!string.IsNullOrEmpty(departureDate))
            {
                string[] date = departureDate.Split('-');
                 departureDateTime = new DateTime(Int32.Parse(date[0]),Int32.Parse( date[1]),Int32.Parse( date[2]));
            }

            if (!string.IsNullOrEmpty(arrivalDate))
            {
                string[] date = arrivalDate.Split('-');
                arrivalDateTime = new DateTime(Int32.Parse(date[0]), Int32.Parse(date[1]), Int32.Parse(date[2]));
            }


            bool flag = false;
            if(departureLocation != null && arrivalLocation != null && numberOfPassengers > 0 && departureDate != null && arrivalDate != null)
            {
                flag = true;
            }

            if (flag)
            {
                List<Let> temp = Letovi.FindByLocation(departureLocation, arrivalLocation);

                List<Let> temp2 = Letovi.FindByDateInterval(temp, departureDateTime, arrivalDateTime);

               

                foreach (Let l in temp2)
                {
                    bool flagRez = false;
                    foreach (Rezervacija r in Letovi.RezervacijeList)
                    {
                        if (r.Let.ID.Equals(l.ID))
                        {
                            flagRez = true; 
                        }
                    }

                    Letovi.UpdateStatusLeta(l);
                    if (!l.IsDeleted )
                    {
                        if ((l.BrSlobodnihMesta >= numberOfPassengers && l.Status == 0)) {
                            
                                retVal.Add(l);
                            
                        }
                        if (flagRez && l.BrSlobodnihMesta == 0)
                        {
                            retVal.Add(l);
                        }
                    }
                }
               // return retVal;
            }
            else
            {
               // List<Let> temp = null;
                List<Let> temp = Letovi.FindByLocation(departureLocation, arrivalLocation);

                List<Let> temp2 = Letovi.FindByDateInterval(temp, departureDateTime, arrivalDateTime);

                foreach (Let l in temp2)
                {

                    bool flagRez = false;
                    foreach (Rezervacija r in Letovi.RezervacijeList)
                    {
                        if (r.Let.ID.Equals(l.ID))
                        {
                            flagRez = true;
                        }
                    }

                    Letovi.UpdateStatusLeta(l);
                    if (!l.IsDeleted && l.BrSlobodnihMesta >= numberOfPassengers && l.Status == 0)
                    {
                        retVal.Add(l);
                    }

                    if (flagRez && l.BrSlobodnihMesta == 0)
                    {
                        retVal.Add(l);
                    }
                }

            }



            if (sort == 0)
            {
                BubbleSort(retVal, true);
            }
            else
            {
                BubbleSort(retVal, false);
            }
                return retVal;
           
        }

        [HttpGet]
        
        [Route("api/letovi/all")]
        public List<Let> GetAll(string departureLocation, string arrivalLocation,int sort)
        {
            User user = (User)System.Web.HttpContext.Current.Session["User"];
            List<Let> retVal = new List<Let>();
            //  Console.WriteLine(user.Username);
            //if (departureLocation != null)
            //{


            //    List<Let> temp = Letovi.FindByLocation(departureLocation);

            //    foreach (Let l in temp)
            //    {
                    
            //            retVal.Add(l);
                    
            //    }
            //}
            //else
            //{
                foreach (Let l in Letovi.LetoviList)
                {
                Letovi.UpdateStatusLeta(l);
                    if (l.Status.Equals(StatusLeta.Aktivan) && l.IsDeleted == false && l.Status == 0)
                    {

                        retVal.Add(l);
                    }
                }
           // }
            if (sort == 0)
            {
                
                BubbleSort(retVal, true);
            }
            else
            {
                BubbleSort(retVal, false);
            }
            return retVal;

        }


        [HttpGet]
        [Route("api/letovi/{id}")]
        public Let Get(int id)
        {
            User user = (User)System.Web.HttpContext.Current.Session["User"];
            //  Console.WriteLine(user.Username);

            
            Let retVal = null;
            foreach (Let l in Letovi.LetoviList)
            {
                if (!l.IsDeleted && l.ID.Equals(id))
                {
                    retVal = l;
                    break;
                }
            }
            return retVal;
        }

        [HttpDelete]
        [Route("api/letovi/delete/{id}")]
        public IHttpActionResult Delete(int id)
        {
            int index = -1;
            foreach (Let l in Letovi.LetoviList)
            {
                if (l.ID.Equals(id))
                {
                    index = Letovi.LetoviList.IndexOf(l);
                    break;
                }
            }
           

            if (index != -1) {

                bool flag = false;
                foreach (Rezervacija r in Letovi.RezervacijeList)
                {
                    if (r.Let.ID.Equals(id) && (r.Status.Equals(StatusReazervacije.Kreirana) || r.Status.Equals(StatusReazervacije.Odobrena)))
                    {
                        flag = true;
                    }
                }

                if (!flag) {
                    Letovi.LetoviList.ElementAt(index).IsDeleted = true;
                    Letovi.LetoviList.ElementAt(index).Status = StatusLeta.Otkazan;
                    Letovi.WriteListToJsonFile(Letovi.LetoviList, Letovi.filePathLetovi);

                    foreach (Rezervacija r in Letovi.RezervacijeList)
                    {
                        if (r.Let.ID.Equals(id) && (r.Status.Equals(StatusReazervacije.Otkazana) || r.Status.Equals(StatusReazervacije.Zavrsena)))
                        {
                            r.Let.IsDeleted = true;
                            r.Let.Status = StatusLeta.Otkazan;
                        }
                    }

                    Letovi.WriteListToJsonFile(Letovi.RezervacijeList, Letovi.filePathRezervacije);

                    foreach (User u in Users.UsersList)
                    {
                        u.Rezervacije = Letovi.RezervacijeList.Where(r => r.Korisnik.Equals(u.Username)).ToList();
                    }

                    Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);


                    foreach (Aviokompanija a in Letovi.AviokompanijeList)
                    {
                        a.Letovi = Letovi.LetoviList.Where(l => l.Aviokompanija.Equals(a.Name)).ToList();
                    }

                    Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);


                    return Ok();

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
        }

        [HttpPut]
        [Route("api/letovi/put/izmena")]
        public IHttpActionResult IzmenaLeta(Let let)
        {
            if (string.IsNullOrEmpty(let.Aviokompanija) || string.IsNullOrEmpty(let.PolaznaDestinacija) || string.IsNullOrEmpty(let.DolaznaDestinacija) || let.DatumIVremePolaska.Year == 1 || let.DatumIVremeDolaska.Year == 1)
            {
                return BadRequest();
            }


            int index = -1;
            foreach (Let l in Letovi.LetoviList)
            {
                if (l.ID.Equals(let.ID))
                {
                    index = Letovi.LetoviList.IndexOf(l);
                    break;
                }
            }

            string aviokompanijaTemp = null;
            foreach (Aviokompanija a in Letovi.AviokompanijeList)
            {
                if (let.Aviokompanija.Equals(a.Name))
                {
                    aviokompanijaTemp = a.Name;
                }
            }

            if (DateTime.Compare(let.DatumIVremePolaska, let.DatumIVremeDolaska) > 0)
            {
                return BadRequest();
            }


            if (index != -1)
            {

                bool flag = false;
                foreach (Rezervacija r in Letovi.RezervacijeList)
                {
                    if (r.Let.ID.Equals(let.ID) && (r.Status.Equals(StatusReazervacije.Kreirana) || r.Status.Equals(StatusReazervacije.Odobrena)))
                    {
                        flag = true;
                    }
                }

                Letovi.LetoviList.ElementAt(index).Aviokompanija = aviokompanijaTemp;
                Letovi.LetoviList.ElementAt(index).DatumIVremeDolaska = let.DatumIVremeDolaska;
                Letovi.LetoviList.ElementAt(index).DatumIVremePolaska = let.DatumIVremePolaska;
                if (!flag)
                {
                    Letovi.LetoviList.ElementAt(index).Cena = let.Cena;
                }

                Letovi.LetoviList.ElementAt(index).BrSlobodnihMesta = let.BrSlobodnihMesta;
                //if (Letovi.LetoviList.ElementAt(index).BrSlobodnihMesta > let.BrSlobodnihMesta)
                //{
                //    Letovi.LetoviList.ElementAt(index).BrZauzetihMesta =  ;
                //}
                Letovi.LetoviList.ElementAt(index).IsDeleted = false;
                Letovi.LetoviList.ElementAt(index).Status = StatusLeta.Aktivan;

                Letovi.WriteListToJsonFile(Letovi.LetoviList, Letovi.filePathLetovi);

                foreach (Aviokompanija a in Letovi.AviokompanijeList)
                {
                    a.Letovi = Letovi.LetoviList.Where(l => l.Aviokompanija.Equals(a.Name)).ToList();
                }

                Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);
                return Ok();
            }
            else
            {

                //Let l = new Let();
                //l.Aviokompanija = aviokompanijaTemp;
                //l.PolaznaDestinacija = let.PolaznaDestinacija;
                //l.DolaznaDestinacija = let.DolaznaDestinacija;
                //l.DatumIVremeDolaska = let.DatumIVremeDolaska;
                //l.DatumIVremePolaska = let.DatumIVremePolaska;
                //l.Cena = let.Cena;
                //l.BrSlobodnihMesta = let.BrSlobodnihMesta;
                //l.BrZauzetihMesta = 0;
                //l.IsDeleted = false;
                //l.Status = StatusLeta.Aktivan;
                //Letovi.LetoviList.Add(l);
                //Letovi.WriteListToJsonFile(Letovi.LetoviList, Letovi.filePathLetovi);

                //foreach (Aviokompanija a in Letovi.AviokompanijeList)
                //{
                //    a.Letovi = Letovi.LetoviList.Where(le => le.Aviokompanija.Equals(a.Name)).ToList();
                //}

                //Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);
                return BadRequest();
            }


        }

        [HttpPost]
        [Route("api/letovi/post/")]
        public IHttpActionResult PostLet(Let let)
        {
            
            if (string.IsNullOrEmpty(let.Aviokompanija) || string.IsNullOrEmpty(let.PolaznaDestinacija) || string.IsNullOrEmpty(let.DolaznaDestinacija) || let.DatumIVremePolaska.Year == 1 || let.DatumIVremeDolaska.Year == 1 )
            {
                return BadRequest();
            }

            
            int index = -1;
            foreach (Let l in Letovi.LetoviList)
            {
                if (l.ID.Equals(let.ID))
                {
                    index = Letovi.LetoviList.IndexOf(l);
                    break;
                }
            }
            string aviokompanijaTemp = null;
            foreach(Aviokompanija a in Letovi.AviokompanijeList)
            {
                if (let.Aviokompanija.Equals(a.Name))
                {
                    aviokompanijaTemp = a.Name;
                }
            }

            //bool flagDate = false;
            if(DateTime.Compare(let.DatumIVremePolaska,let.DatumIVremeDolaska) > 0)
            {
                return BadRequest();
            }
            

            if (index != -1)
            {

                //bool flag = false;
                //foreach (Rezervacija r in Letovi.RezervacijeList)
                //{
                //    if (r.Let.ID.Equals(let.ID) && (r.Status.Equals(StatusReazervacije.Kreirana) || r.Status.Equals(StatusReazervacije.Odobrena)))
                //    {
                //        flag = true;
                //    }
                //}

                //Letovi.LetoviList.ElementAt(index).Aviokompanija = aviokompanijaTemp;
                //Letovi.LetoviList.ElementAt(index).DatumIVremeDolaska = let.DatumIVremeDolaska;
                //Letovi.LetoviList.ElementAt(index).DatumIVremePolaska = let.DatumIVremePolaska;
                //if (!flag)
                //{
                //    Letovi.LetoviList.ElementAt(index).Cena = let.Cena;
                //}
               
                //Letovi.LetoviList.ElementAt(index).BrSlobodnihMesta = let.BrSlobodnihMesta;
                ////if (Letovi.LetoviList.ElementAt(index).BrSlobodnihMesta > let.BrSlobodnihMesta)
                ////{
                ////    Letovi.LetoviList.ElementAt(index).BrZauzetihMesta =  ;
                ////}
                //Letovi.LetoviList.ElementAt(index).IsDeleted = false;
                //Letovi.LetoviList.ElementAt(index).Status = StatusLeta.Aktivan;

                //Letovi.WriteListToJsonFile(Letovi.LetoviList, Letovi.filePathLetovi);

                //foreach (Aviokompanija a in Letovi.AviokompanijeList)
                //{
                //    a.Letovi = Letovi.LetoviList.Where(l => l.Aviokompanija.Equals(a.Name)).ToList();
                //}

                //Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);
                return BadRequest();
            }
            else
            {
                
                Let l = new Let();
                l.Aviokompanija = aviokompanijaTemp;
                l.PolaznaDestinacija = let.PolaznaDestinacija;
                l.DolaznaDestinacija = let.DolaznaDestinacija;
                l.DatumIVremeDolaska = let.DatumIVremeDolaska;
                l.DatumIVremePolaska = let.DatumIVremePolaska;
                l.Cena = let.Cena;
               l.BrSlobodnihMesta = let.BrSlobodnihMesta;
                l.BrZauzetihMesta = 0;
                l.IsDeleted = false;
                l.Status = StatusLeta.Aktivan;
                Letovi.LetoviList.Add(l);
                Letovi.WriteListToJsonFile(Letovi.LetoviList, Letovi.filePathLetovi);

                foreach (Aviokompanija a in Letovi.AviokompanijeList)
                {
                    a.Letovi = Letovi.LetoviList.Where(le => le.Aviokompanija.Equals(a.Name)).ToList();
                }

                Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);
                return Ok();
            }
            
        }

        public static void BubbleSort(List<Let> list, bool ascending = true)
        {
            int n = list.Count;
            bool swapped;
            do
            {
                swapped = false;
                for (int i = 1; i < n; i++)
                {
                    // Postavljamo uslov za rastući ili opadajući redosled
                    bool condition = ascending ? list[i - 1].Cena > list[i].Cena : list[i - 1].Cena < list[i].Cena;
                    if (condition)
                    {
                        // Swap elements
                        Let temp = list[i];
                        list[i] = list[i - 1];
                        list[i - 1] = temp;
                        swapped = true;
                    }
                }
                n--;
            } while (swapped);
        }


        
    }
}

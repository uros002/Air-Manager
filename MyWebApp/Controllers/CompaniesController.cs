using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class CompanieEdit{
        public bool IsDeleted { get; set; }

        public string OldName { get; set; }
        public string NewName { get; set; }

        public string Address { get; set; }

        public string ContactInformation { get; set; }

        public List<Recenzija> Recenzije { get; set; }

        public List<Let> Letovi { get; set; }
    };
    public class CompaniesController : ApiController
    {
        [HttpGet]
        public List<Aviokompanija> Get()
        {
            List<Aviokompanija> retVal = new List<Aviokompanija>();
            foreach(Aviokompanija a in Letovi.AviokompanijeList)
            {
                if (!a.IsDeleted)
                {
                    retVal.Add(a);
                }
            }
            return retVal;
        }

        [HttpGet]
        [Route("api/companies/{name}")]
        public Aviokompanija Get(string name)
        {
            Letovi.AviokompanijeList = Letovi.ReadCompaniesFromJson();

            Aviokompanija retVal = null;
            foreach (Aviokompanija a in Letovi.AviokompanijeList)
            {
                if (a.Name.Equals(name))
                {
                    retVal = a;
                    break;
                }
            }
            return retVal;
        }



        [HttpGet]
        [Route("api/companies/search")]
        public List<Aviokompanija> GetSearch(string name, string address, string contact)
        {
            Letovi.AviokompanijeList = Letovi.ReadCompaniesFromJson();

            List<Aviokompanija> retVal = new List<Aviokompanija>();
            List<Aviokompanija> temp1 = new List<Aviokompanija>();
            if (string.IsNullOrEmpty(name))
            {
                temp1 = Letovi.AviokompanijeList;
            }
            else
            {
                foreach (Aviokompanija a in Letovi.AviokompanijeList)
                {
                    if (a.Name.ToLower().Contains(name.ToLower()))
                    {
                        temp1.Add(a);

                    }
                }
            }


            List<Aviokompanija> temp2 = new List<Aviokompanija>();
            if (string.IsNullOrEmpty(address))
            {
                temp2 = temp1;
            }
            else
            {
                foreach (Aviokompanija a in temp1)
                {
                    if (a.Address.ToLower().Contains(address.ToLower()))
                    {
                        temp2.Add(a);

                    }
                }
            }

            List<Aviokompanija> temp3 = new List<Aviokompanija>();
            if (string.IsNullOrEmpty(contact))
            {
                temp3 = temp2;
            }
            else
            {
                foreach (Aviokompanija a in temp2)
                {
                    if (a.ContactInformation.ToLower().Contains(contact.ToLower()))
                    {
                        temp3.Add(a);

                    }
                }
            }

            retVal = temp3;

            

            return retVal;
        }

        [HttpPut]
        [Route("api/companies/put/{name}")]
        public IHttpActionResult Put(string name)
        {
            int index = -1;
            foreach(Aviokompanija a in Letovi.AviokompanijeList)
            {
                if (a.Name.Equals(name))
                {
                    index = Letovi.AviokompanijeList.IndexOf(a);
                }
            }



            if(index != -1)
            {
                bool flag = false;
                foreach(Let l in Letovi.AviokompanijeList[index].Letovi)
                {
                    if (l.Status.Equals(StatusLeta.Aktivan))
                    {
                        flag = true;
                        break;
                    }
                }
                if (!flag)
                {
                    Letovi.AviokompanijeList[index].IsDeleted = true;
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

        [HttpPost]
        [Route("api/companies/post/")]
        public IHttpActionResult Post(CompanieEdit aviokompanija)
        {

            if(string.IsNullOrEmpty(aviokompanija.NewName) || string.IsNullOrEmpty(aviokompanija.Address) || string.IsNullOrEmpty(aviokompanija.ContactInformation))
            {
                return BadRequest();
            }

            if (string.IsNullOrEmpty(aviokompanija.OldName))
            {
                aviokompanija.OldName = aviokompanija.NewName;
            }

            int index = -1;
            foreach (Aviokompanija a in Letovi.AviokompanijeList)
            {
                if (a.Name.Equals(aviokompanija.OldName))
                {
                    index = Letovi.AviokompanijeList.IndexOf(a);
                    break;
                }
            }

            if (index != -1)
            {
                Letovi.AviokompanijeList[index].Name = aviokompanija.NewName;
                Letovi.AviokompanijeList[index].Address = aviokompanija.Address;
                Letovi.AviokompanijeList[index].ContactInformation = aviokompanija.ContactInformation;
               

                foreach (Let l in Letovi.AviokompanijeList[index].Letovi)
                {
                    l.Aviokompanija = aviokompanija.NewName;
                }

                Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);


                foreach(Let l in Letovi.LetoviList)
                {
                    if (l.Aviokompanija.Equals(aviokompanija.OldName))
                    {
                        l.Aviokompanija = aviokompanija.NewName;
                    }
                }

                Letovi.WriteListToJsonFile(Letovi.LetoviList, Letovi.filePathLetovi);


                foreach(Rezervacija r in Letovi.RezervacijeList)
                {
                    if (r.Aviokompanija.Equals(aviokompanija.OldName))
                    {
                        r.Aviokompanija = aviokompanija.NewName;
                    }
                }

                Letovi.WriteListToJsonFile(Letovi.RezervacijeList, Letovi.filePathRezervacije);

                foreach(User u in Users.UsersList)
                {
                    u.Rezervacije = Letovi.RezervacijeList.Where(r => r.Korisnik.Equals(u.Username)).ToList();
                }

                Letovi.WriteListToJsonFile(Users.UsersList, Users.filePathUsers);

                foreach(Recenzija r in Letovi.RecenzijeList)
                {
                    if (r.Aviokompanija.Equals(aviokompanija.OldName))
                    {
                        r.Aviokompanija = aviokompanija.NewName;
                    }
                }

                Letovi.WriteListToJsonFile(Letovi.RecenzijeList, Letovi.filePathRezervacije);

                foreach(Aviokompanija a in Letovi.AviokompanijeList)
                {
                    a.Recenzije = Letovi.RecenzijeList.Where(r => r.Aviokompanija.Equals(a.Name)).ToList();
                }

                Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);

                return Ok();
            }
            else
            {
                Aviokompanija a = new Aviokompanija(aviokompanija.NewName, aviokompanija.Address, aviokompanija.ContactInformation);
                foreach(Aviokompanija av in Letovi.AviokompanijeList)
                {
                    if (av.Name.Equals(aviokompanija.NewName)){
                        return BadRequest();
                    }
                }
                Letovi.AviokompanijeList.Add(a);
                Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);
                return Ok();
            }
        }
    }


}

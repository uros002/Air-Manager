using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class RecenzijaController : ApiController
    {
        [HttpGet]
        public List<Recenzija> Get()
        {
            return Letovi.RecenzijeList;
        }

        [HttpPut]
        [Route("api/recenzija/accept/{id}")]
        public IHttpActionResult Accept(int id)
        {
            int index = -1; 
            foreach(Recenzija r in Letovi.RecenzijeList)
            {
                if (r.ID.Equals(id))
                {
                    index = Letovi.RecenzijeList.IndexOf(r);
                }
            }

            if (index != -1)
            {
                Letovi.RecenzijeList.ElementAt(index).Status = StatusRecenzije.Odobrena;
                Letovi.WriteListToJsonFile(Letovi.RecenzijeList, Letovi.filePathRecenzije);
                int avioIndex = -1;
                foreach(Aviokompanija a in Letovi.AviokompanijeList)
                {
                    if (a.Name.Equals(Letovi.RecenzijeList[index].Aviokompanija))
                    {
                        avioIndex = Letovi.AviokompanijeList.IndexOf(a);
                    }
                }

                if (avioIndex != -1)
                {
                    int tempIndex = -1;
                    foreach(Recenzija r in Letovi.AviokompanijeList[avioIndex].Recenzije)
                    {
                        if (r.ID.Equals(id))
                        {
                            tempIndex = Letovi.AviokompanijeList[avioIndex].Recenzije.IndexOf(r);
                        }
                    }

                    if (tempIndex != -1)
                    {
                        Letovi.AviokompanijeList[avioIndex].Recenzije[tempIndex].Status = StatusRecenzije.Odobrena;
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
            else
            {
                return BadRequest();
            }
        }


        [HttpPut]
        [Route("api/recenzija/decline/{id}")]
        public IHttpActionResult Decline(int id)
        {
            int index = -1;
            foreach (Recenzija r in Letovi.RecenzijeList)
            {
                if (r.ID.Equals(id))
                {
                    index = Letovi.RecenzijeList.IndexOf(r);
                }
            }

            if (index != -1)
            {
                Letovi.RecenzijeList.ElementAt(index).Status = StatusRecenzije.Odbijena;
                Letovi.WriteListToJsonFile(Letovi.RecenzijeList, Letovi.filePathRecenzije);
                int avioIndex = -1;
                foreach (Aviokompanija a in Letovi.AviokompanijeList)
                {
                    if (a.Name.Equals(Letovi.RecenzijeList[index].Aviokompanija))
                    {
                        avioIndex = Letovi.AviokompanijeList.IndexOf(a);
                    }
                }
                if (avioIndex != -1)
                {
                    int tempIndex = -1;
                    foreach (Recenzija r in Letovi.AviokompanijeList[avioIndex].Recenzije)
                    {
                        if (r.ID.Equals(id))
                        {
                            tempIndex = Letovi.AviokompanijeList[avioIndex].Recenzije.IndexOf(r);
                        }
                    }

                    if (tempIndex != -1)
                    {
                        Letovi.AviokompanijeList[avioIndex].Recenzije[tempIndex].Status = StatusRecenzije.Odbijena;
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
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("api/recenzija/post")]
        public IHttpActionResult Post(Recenzija recenzija)
        {
            if (string.IsNullOrEmpty(recenzija.Naslov) || string.IsNullOrEmpty(recenzija.Sadrzaj))
            {
                return BadRequest();
            }

            

            User currentUser = (User)System.Web.HttpContext.Current.Session["User"];

            foreach(Recenzija r in Letovi.RecenzijeList)
            {
                if(r.Recezent.Username.Equals(currentUser.Username) && r.Aviokompanija.Equals(recenzija.Aviokompanija))
                {
                    return BadRequest();
                }
            }

            string fullPath = @"\Images";
            Recenzija tmp = new Recenzija();
            if (string.IsNullOrEmpty(recenzija.ImagePath))
            {
                tmp.ImagePath = null;
                tmp.Image = null;
            }
            else{
                string[] delovi = recenzija.ImagePath.Split('\\');
                
                tmp.ImagePath = Path.Combine(fullPath,delovi[2]);
                tmp.Image = null;
             //   tmp.Image = GetImageBytes(tmp.ImagePath);


            }

             Recenzija nova = new Recenzija()
            {
                ID = Letovi.GenerateId(),
                Recezent = currentUser,
                Aviokompanija = recenzija.Aviokompanija,
                Naslov = recenzija.Naslov,
                Sadrzaj = recenzija.Sadrzaj,
                ImagePath = tmp.ImagePath,
                Image = tmp.Image,
                Status = StatusRecenzije.Kreirana
            };


            Letovi.RecenzijeList.Add(nova);
            Letovi.WriteListToJsonFile(Letovi.RecenzijeList, Letovi.filePathRecenzije);

            //int index = -1;
            //foreach(Aviokompanija a in Letovi.AviokompanijeList)
            //{
            //    if (a.Name.Equals(recenzija.Aviokompanija))
            //    {
            //        index = Letovi.AviokompanijeList.IndexOf(a);
            //    }
            //}

            int index = Letovi.AviokompanijeList.FindIndex(a => a.Name.Equals(recenzija.Aviokompanija));

            if(index != -1)
            {
                Letovi.AviokompanijeList.ElementAt(index).Recenzije.Add(nova);
                Letovi.WriteListToJsonFile(Letovi.AviokompanijeList, Letovi.filePathAviokompanije);
                return Ok();
            }
            else
            {
                return BadRequest();
            }

            //return Ok();
        }

        public static byte[] GetImageBytes(string imagePath)
        {
            if (File.Exists(imagePath))
            {
                return File.ReadAllBytes(imagePath);
            }
            throw new FileNotFoundException("Image not found.", imagePath);
        }


    }
}

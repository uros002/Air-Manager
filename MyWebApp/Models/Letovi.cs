using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.IO;



namespace MyWebApp.Models
{
    public class Letovi
    {

        public static string filePathAviokompanije = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\aviokompanije.json";
        public static string filePathLetovi = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\letovi.json";
        public static string filePathRezervacije = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\rezervacije.json";
        public static string filePathRecenzije = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\recenzije.json";


        public static List<Aviokompanija> AviokompanijeList { get; set; } = ReadCompaniesFromJson();
        //    = new List<Aviokompanija>()
        //{
        //    new Aviokompanija("Wizz", "nepoznata", "wiiz.com"),
        //    new Aviokompanija("Dubai", "nepoznata", "dubai.com"),
        //    new Aviokompanija("Emirates Air", "nepoznata", "emiratesair.com")
        //};

        public Letovi()
        {
            AviokompanijeList  = ReadCompaniesFromJson();
            LetoviList  = ReadLetoviFromJson();
            RezervacijeList  = ReadReservationsFromJson();
            RecenzijeList = ReadRecenzijeFromJson();

        }

        public static List<Rezervacija> FindAllReservations()
        {
            return RezervacijeList;
        }

        public static List<Aviokompanija> FindAllCompanies()
        {
            return AviokompanijeList;
        }

        public static List<Let> LetoviList { get; set; } = ReadLetoviFromJson();
        //= new List<Let>()
        //{

        //    new Let(){ID = GenerateId() , Aviokompanija = AviokompanijeList[0].Name, PolaznaDestinacija = "Beograd", DolaznaDestinacija = "Pariz", DatumIVremePolaska = DateTime.Today.ToString("dd/MM/yyyy"), Status = StatusLeta.Aktivan, BrSlobodnihMesta = 50 , BrZauzetihMesta = 0, Cena = 25},
        //     new Let(){ID = GenerateId() , Aviokompanija = AviokompanijeList[1].Name, PolaznaDestinacija = "Beograd", DolaznaDestinacija = "Dubai", DatumIVremePolaska = DateTime.Today.ToString("dd/MM/yyyy"), Status = StatusLeta.Aktivan },
        //      new Let(){ID = GenerateId() ,  Aviokompanija = AviokompanijeList[2].Name, PolaznaDestinacija = "Beograd", DolaznaDestinacija = "Barcelona", DatumIVremePolaska = DateTime.Today.ToString("dd/MM/yyyy"), Status = StatusLeta.Aktivan }

        //};
        public static List<Rezervacija> RezervacijeList { get; set; } = ReadReservationsFromJson();
        //    = new List<Rezervacija>()
        //{
        //    new Rezervacija(){ID = GenerateId() , Aviokompanija = LetoviList[0].Aviokompanija,Let = LetoviList[0],BrPutnika = 1, UkupnaCena = LetoviList[0].Cena,Status = StatusReazervacije.Kreirana},
        //    new Rezervacija(){ID = GenerateId() , Aviokompanija = LetoviList[1].Aviokompanija,Let = LetoviList[1],BrPutnika = 1, UkupnaCena = LetoviList[1].Cena,Status = StatusReazervacije.Kreirana}


        //};

        public static List<Recenzija> RecenzijeList { get; set; } = ReadRecenzijeFromJson();

        

        public static Let FindLetById(int id)
        {
            return LetoviList.Find(item => item.ID == id);
        }

        public static List<Let> FindByLocation(string startLocation,string arrivalLocation = "")
        {
            List<Let> retVal = new List<Let>();
            if (string.IsNullOrEmpty(startLocation))
            {
                if (!string.IsNullOrEmpty(arrivalLocation))
                {
                    foreach (Let l in Letovi.LetoviList)
                    {
                        if (l.DolaznaDestinacija.ToLower().Contains(arrivalLocation.ToLower()))
                        {
                            retVal.Add(l);
                        }
                    }
                }
                else
                {
                    retVal = Letovi.LetoviList;
                }
            }else if (string.IsNullOrEmpty(arrivalLocation))
            {
                foreach (Let l in Letovi.LetoviList)
                {
                    if (l.PolaznaDestinacija.ToLower().Contains(startLocation.ToLower()))
                    {
                        retVal.Add(l);
                    }
                }
            }
            else
            {
                //List<Let> retVal = new List<Let>();
                foreach (Let l in Letovi.LetoviList)
                {
                if (l.PolaznaDestinacija.ToLower().Contains(startLocation.ToLower()) && l.DolaznaDestinacija.ToLower().Contains(arrivalLocation.ToLower()) )
                    {
                        retVal.Add(l);
                    }
                }
                //return retVal;
           }

            return retVal;
        }

        public static List<Let> FindByDateInterval(List<Let> lista,DateTime firstDate,DateTime seccondDate)
        {
            List<Let> retVal = new List<Let>();
            if (firstDate.Year == 1)
            {
                if (seccondDate.Year == 1)
                {
                    retVal = lista;
                }
                else
                {
                    foreach (Let l in lista)
                    {
                        if (DateTime.Compare(l.DatumIVremePolaska, seccondDate) <= 0)
                        {
                            retVal.Add(l);
                        }
                    }
                }

            }
            else if (seccondDate.Year == 1)
            {
                foreach (Let l in lista)
                {
                    if (DateTime.Compare(l.DatumIVremePolaska, firstDate) >= 0)
                    {
                        retVal.Add(l);
                    }
                }
            }
            else
            {


                foreach (Let l in lista)
                {
                    if (DateTime.Compare(l.DatumIVremePolaska, firstDate) >= 0 && DateTime.Compare(l.DatumIVremePolaska, seccondDate) <= 0)
                    {
                        retVal.Add(l);
                    }
                }

            }
            return retVal;
        }

        public static int GenerateId()
        {
            return Math.Abs(Guid.NewGuid().GetHashCode());
        }


        public static void WriteListToJsonFile<T>(List<T> list,string filePath)
        {
            string json = JsonConvert.SerializeObject(list, Formatting.Indented);
            File.WriteAllText(filePath, json);
            Console.WriteLine($"JSON je uspešno upisan u fajl: {filePath}");
        }

        public static List<Let> ReadLetoviFromJson()
        {
            string filePath = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\letovi.json";

            if (!File.Exists(filePathLetovi))
            {
                throw new FileNotFoundException($"The file {filePathLetovi} does not exist.");
            }

            string json = File.ReadAllText(filePathLetovi);
            List<Let> letovi = JsonConvert.DeserializeObject<List<Let>>(json);
            return letovi;
        }

        public static List<Aviokompanija> ReadCompaniesFromJson()
        {
            string filePath = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\aviokompanije.json";

            if (!File.Exists(filePathAviokompanije))
            {
                throw new FileNotFoundException($"The file {filePathAviokompanije} does not exist.");
            }

            string json = File.ReadAllText(filePathAviokompanije);
            List<Aviokompanija> aviokompanije = JsonConvert.DeserializeObject<List<Aviokompanija>>(json);
            return aviokompanije;
        }


        public static List<Rezervacija> ReadReservationsFromJson()
        {
            string filePath = @"C:\Users\User\source\repos\MyWebApp\MyWebApp\Database\rezervacije.json";

            if (!File.Exists(filePathRezervacije))
            {
                throw new FileNotFoundException($"The file {filePathRezervacije} does not exist.");
            }

            string json = File.ReadAllText(filePathRezervacije);
            List<Rezervacija> data = JsonConvert.DeserializeObject<List<Rezervacija>>(json);
            return data;
        }


        private static List<Recenzija> ReadRecenzijeFromJson()
        {
            

            if (!File.Exists(filePathRecenzije))
            {
                throw new FileNotFoundException($"The file {filePathRecenzije} does not exist.");
            }

            string json = File.ReadAllText(filePathRecenzije);
            List<Recenzija> data = JsonConvert.DeserializeObject<List<Recenzija>>(json);
            return data;
        }

        public static void UpdateStatusLeta(Let let)
        {
            DateTime now = DateTime.Now;
            bool flag = false;
            
            if (DateTime.Compare(let.DatumIVremePolaska, now) < 0)
            {
                TimeSpan diff = let.DatumIVremePolaska - now;

                if (diff.TotalSeconds < 0)
                {
                    if (let.Status.Equals(StatusLeta.Aktivan))
                    {
                        let.Status = StatusLeta.Zavrsen;
                        flag = true;

                        
                    }
                }
            }
            if (flag)
            {
                WriteListToJsonFile(LetoviList, filePathLetovi);

                foreach(Aviokompanija a in AviokompanijeList)
                {
                    if (a.Name.Equals(let.Aviokompanija))
                    {
                        foreach(Let l in a.Letovi)
                        {
                            if (l.ID.Equals(let.ID))
                            {
                                l.Status = StatusLeta.Zavrsen;
                            }
                        }
                    }
                }
                WriteListToJsonFile(AviokompanijeList, filePathAviokompanije);


                foreach(Rezervacija r in RezervacijeList)
                {
                    if (r.Let.ID.Equals(let.ID))
                    {
                        r.Let.Status = StatusLeta.Zavrsen;

                        if (r.Status.Equals(StatusReazervacije.Odobrena))
                        {
                            r.Status = StatusReazervacije.Zavrsena;
                        }
                        else if (r.Status.Equals(StatusReazervacije.Kreirana))
                        {
                            r.Status = StatusReazervacije.Otkazana;
                        }
                    }

                }

                WriteListToJsonFile(RezervacijeList, filePathRezervacije);


                foreach(User u in Users.UsersList)
                {
                    u.Rezervacije = RezervacijeList.Where(r => r.Korisnik.Equals(u.Username)).ToList();
                }

                WriteListToJsonFile(Users.UsersList, Users.filePathUsers);
            }

        }

    }
}
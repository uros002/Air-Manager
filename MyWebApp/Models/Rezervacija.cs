using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{

    public enum StatusReazervacije { Kreirana,Odobrena,Otkazana,Zavrsena}
    public class Rezervacija
    {
        public int ID { get; set; }

        public string Korisnik { get; set; }

        public string Aviokompanija { get; set; }

        public Let Let { get; set; }

        public int BrPutnika{get;set;}

        public double UkupnaCena { get; set; }

        public StatusReazervacije Status { get; set; }

        public Rezervacija()
        {

        }
    }
}
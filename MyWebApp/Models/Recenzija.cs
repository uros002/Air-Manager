
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public enum StatusRecenzije { Kreirana,Odobrena,Odbijena}
    public class Recenzija
    {

        public int ID { get; set; }
        public User Recezent { get; set; }

        public string Aviokompanija { get; set; }

        public string Naslov { get; set; }


        public string Sadrzaj { get; set; }

        public byte[] Image { get; set; }

        public string ImagePath { get; set; }

        public StatusRecenzije Status { get; set; }

        public Recenzija()
        {

        }

    }
}
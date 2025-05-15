using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class Aviokompanija
    {

        public bool IsDeleted { get; set; }
        public string Name { get; set; }

        public string Address { get; set; }

        public string ContactInformation { get; set; }

        public List<Recenzija> Recenzije { get; set; }

        public List<Let> Letovi { get; set; }

        public Aviokompanija(string name,string add, string contact)
        {
            this.Name = name;
            this.Address = add;
            this.ContactInformation = contact;
            Recenzije = new List<Recenzija>();
            Letovi = new List<Let>();
            IsDeleted = false;
        }

        public Aviokompanija()
        {
        }
    }
}
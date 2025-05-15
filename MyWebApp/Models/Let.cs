using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public enum StatusLeta { Aktivan,Otkazan,Zavrsen}
    public class Let
    {
        public bool IsDeleted { get; set; }

        public int ID { get; set; }
        public string Aviokompanija { get; set; }

        public string PolaznaDestinacija { get; set; }

        public string DolaznaDestinacija { get; set; }

        public DateTime DatumIVremePolaska { get; set; }

        public DateTime DatumIVremeDolaska { get; set; }

        public int BrSlobodnihMesta { get; set; }

        public int BrZauzetihMesta { get; set; }

        public double Cena { get; set; }


        public StatusLeta Status { get; set; }

        public void DoResevation(int num)
        {
            this.BrSlobodnihMesta -= num;
            this.BrZauzetihMesta += num;
        }

        public void UndoResevation(int num)
        {
            this.BrSlobodnihMesta += num;
            this.BrZauzetihMesta -= num;
        }


        public Let()
        {
            IsDeleted = false;
            Status = StatusLeta.Aktivan;
            ID = Letovi.GenerateId();
        }

    }
}
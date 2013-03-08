using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;

namespace CodeCamper.Controllers
{
    [BreezeController]
    public class BreezeController : ApiController
    {
        readonly EFContextProvider<CodeCamperDbContext>  _contextProvider =
            new EFContextProvider<CodeCamperDbContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        [HttpGet]
        public object Lookups()
        {
            var rooms =  _contextProvider.Context.Rooms;
            var tracks =  _contextProvider.Context.Tracks;
            var timeslots =  _contextProvider.Context.TimeSlots;
            return new {rooms, tracks, timeslots};
        }

        [HttpGet]
        public IQueryable<Session> Sessions()
        {
            return _contextProvider.Context.Sessions;
        }

        [HttpGet]
        public IQueryable<Person> Persons()
        {
            return _contextProvider.Context.Persons;
        }

        [HttpGet]
        public IQueryable<Person> Speakers()
        {
            return _contextProvider.Context.Persons
                .Where(p => p.SpeakerSessions.Any());
        }

   }
}
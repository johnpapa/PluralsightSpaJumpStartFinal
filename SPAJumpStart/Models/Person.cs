using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CodeCamper
{
    public class Person
    {
        public Person()
        {
            Gender = " "; // make no assumption
            ImageSource = string.Empty;
        }
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Blog { get; set; }
        public string Twitter { get; set; }

        [StringLength(1,MinimumLength = 1) ]
        public string Gender { get; set; }
        public string ImageSource { get; set; }
        public string Bio { get; set; }

        public virtual ICollection<Session> SpeakerSessions { get; set; }
        public virtual ICollection<Attendance> AttendanceList { get; set; }
    }
}

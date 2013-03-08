using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CodeCamper
{
    public class Session
    {
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Title { get; set; }
        [Required]
        public string Code { get; set; }
        public int SpeakerId { get; set; }
        public int TrackId { get; set; }
        public int TimeSlotId { get; set; }
        public int RoomId { get; set; }
        public string Level { get; set; }
        public string Tags { get; set; }
        public string Description { get; set; }

        public virtual Person Speaker { get; set; }
        public virtual Track Track { get; set; }
        public virtual TimeSlot TimeSlot { get; set; }
        public virtual Room Room { get; set; }

        public virtual ICollection<Attendance> 
            AttendanceList { get; set; }
    }
}

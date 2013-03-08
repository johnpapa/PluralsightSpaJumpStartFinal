using System.Data.Entity.ModelConfiguration;

namespace CodeCamper
{
    public class AttendanceConfiguration : EntityTypeConfiguration<Attendance>
    {
        public AttendanceConfiguration()
        {
            // Attendance has a composite key: SessionId and PersonId
            HasKey(a => new { a.SessionId, a.PersonId });

            // Attendance has 1 Session, Sessions have many Attendance records
            HasRequired(a => a.Session)
                .WithMany(s => s.AttendanceList)
                .HasForeignKey(a => a.SessionId)
                .WillCascadeOnDelete(false);

            // Attendance has 1 Person, Persons have many Attendance records
            HasRequired(a => a.Person)
                .WithMany(p => p.AttendanceList)
                .HasForeignKey(a => a.PersonId)
                .WillCascadeOnDelete(false);
        }
    }
}

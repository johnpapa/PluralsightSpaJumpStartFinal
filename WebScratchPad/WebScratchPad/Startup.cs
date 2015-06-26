using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebScratchPad.Startup))]
namespace WebScratchPad
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

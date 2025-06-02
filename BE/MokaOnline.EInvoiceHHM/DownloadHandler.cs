using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;

namespace MokaOnline.EInvoiceHHM
{
    public class DownloadHandler : IHttpHandler, IRequiresSessionState
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                string input = context.Request.Params["query"];
                JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
                InvoiceAgr arg = javaScriptSerializer.Deserialize<InvoiceAgr>(input);

                Process einvoice_process = new Process(arg.SupplierId, "");
                einvoice_process.DownloadPDF(context, arg.VoucherIds);
            }
            catch (Exception ex)
            {
                context.Response.Write(ex.Message);
            }
        }
    }
}

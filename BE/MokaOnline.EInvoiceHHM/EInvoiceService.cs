using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Web;
using System.Web.Caching;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.SessionState;
using MokaOnline.EInvoice.Core;
using Newtonsoft.Json;
using System.Runtime.Remoting.Contexts;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls.WebParts;
using System.Web.Configuration;
using System.Configuration;

namespace MokaOnline.EInvoiceHHM
{
    [ScriptService()]
    public class EInvoiceService
    {
        private string supplierId { get; set; }
        public EInvoiceService() {
           
            string userID = ConfigurationSettings.AppSettings["userID"];
            string appDatabaseName = ConfigurationSettings.AppSettings["appDatabaseName"];

            if (string.IsNullOrEmpty(userID) || string.IsNullOrEmpty(appDatabaseName))
            {
                //System.Web.HttpContext.Current.Session.Add("userID", "1");
                //System.Web.HttpContext.Current.Session.Add("appDatabaseName", "HHM_Accounting_App");
                SqlDataContext.ExecuteNonQuery($"insert into shop_apilog (UserId, CreatedOn, Uri, Message) select 1, GETDATE(), '', N'Không lấy được databaseName từ AppSettings");
            }
            else
            {
                System.Web.HttpContext.Current.Session.Add("userID", userID);
                System.Web.HttpContext.Current.Session.Add("appDatabaseName", appDatabaseName);
            }
            DataSet data = SqlDataContext.ExecuteSQL("SELECT TOP 1 RTRIM(ma_ncc) AS ma_ncc FROM dmdvcchddt WHERE uu_tien = 1");
            supplierId = data.Tables[0].Rows[0]["ma_ncc"].ToString();
        }
        [WebMethod(EnableSession = true)]
        public ResponseInfo CreateDraft(VoucherEntity voucherInfo)
        {
            System.Web.HttpContext.Current.Session.Add("unit", voucherInfo.ma_dvcs);
            Process einvoice_process = new Process(supplierId, voucherInfo.ma_dvcs);
            return einvoice_process.CreateDraftInvoice(voucherInfo);
        }
        [WebMethod(EnableSession = true)]
        public ResponseInfo UpdateDraft(VoucherEntity voucherInfo)
        {
            System.Web.HttpContext.Current.Session.Add("unit", voucherInfo.ma_dvcs);
            Process einvoice_process = new Process(supplierId, voucherInfo.ma_dvcs);
            return einvoice_process.UpdateDraftInvoice(voucherInfo);
        }
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public ResponseInfo GetInvoicePDF(VoucherEntity voucherInfo)
        {
            System.Web.HttpContext.Current.Session.Add("unit", voucherInfo.ma_dvcs);
            Process einvoice_process = new Process(supplierId, voucherInfo.ma_dvcs);
            return einvoice_process.DownloadPDF(System.Web.HttpContext.Current, voucherInfo);
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public ResponseInfo GetPublishedInv(VoucherEntity voucherInfo)
        {
            System.Web.HttpContext.Current.Session.Add("unit", voucherInfo.ma_dvcs);
            Process einvoice_process = new Process(supplierId, voucherInfo.ma_dvcs);
            ResponseInfo response = einvoice_process.GetPubInvInfo(voucherInfo.stt_rec);
            response.result.invoiceDate = voucherInfo.ngay_ct;
            Dictionary<string, string> res = einvoice_process.GetSerialInfo(voucherInfo.ma_nk);
            if(res != null)
            {
                response.result.invoiceSerial = res["so_seri"];
                response.result.invoiceForm = res["ky_hieu"];
            }
            if(response.result.buyerTaxCode == null)
            {
                response.result.buyerTaxCode = "";
            }
            return response;
        }

        //[WebMethod(EnableSession = true)]
        //public void MappingPublishedInv(string voucherIds, string supplierId)
        //{
        //    Process einvoice_process = new Process(supplierId);
        //    einvoice_process.MappingPubInvInfo(voucherIds);
        //}
    }
}

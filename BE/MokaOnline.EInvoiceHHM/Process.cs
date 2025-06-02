using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
using MokaOnline.EInvoice.Core;
using MokaOnline.EInvoice;
//using MokaOnline.EInvoice.AZInvoice;
//using MokaOnline.Einvoice.FptEinvoice;
using System.IO;
using System.IO.Compression;
using System.Web.Script.Serialization;

namespace MokaOnline.EInvoiceHHM
{
    public class Process
    {
        private MokaOnline.EInvoice.Core.IInvoiceHHM invoice_service_HHM;
        private MokaOnline.EInvoice.Core.IInvoice invoice_service;

        public string SupplierId { get; set; }
        public string Unit { get; set; }


        public Process(string supplierId, string unit)
        {
            this.SupplierId = supplierId;
            this.Unit = unit;

            //Khởi tạo đối tượng xử lý các chức năng của hóa đơn điện tử tương ứng theo service của đơn vị phát hành
            switch (supplierId.ToUpper())
            {
                //case "BKAV":
                //    invoice_service = new Bkav.BkavInvoice();
                //    invoice_service.SupplierId = supplierId;
                //    break;
                case "VIETTEL":
                    invoice_service = new EInvoice.Viettel.ViettelInvoice(supplierId, unit);
                    invoice_service_HHM = new EInvoice.Viettel.ViettelInvoice(supplierId, unit);
                    break;
                //case "MINVOICE":
                //    invoice_service = new MInvoice.MInvoice(supplierId);
                //    break;
                //case "CYBER":
                //    invoice_service = new CyberLotus.CyberInvoice(supplierId);
                //    break;
                //case "AZ":
                //    invoice_service = new AZInvoice.AzInvoice(supplierId);
                //    break;
                //case "FPT":
                //    invoice_service = new FptInvoice(supplierId);
                //    break;
                default:
                    invoice_service = null;
                    break;
            }
        }

        /// <summary>
        /// Lập hóa đơn nháp
        /// </summary>
        /// <param name="voucherIds"></param>
        /// <returns></returns>
        public ResponseInfo CreateDraftInvoice(VoucherEntity voucherInfo)
        {
            if (!(string.IsNullOrEmpty(voucherInfo.ma_ct) && string.IsNullOrEmpty(voucherInfo.stt_rec)))
            {
                string sql = "EXEC Genbyte$EInvoice$GetInvoiceInfo @stt_rec, @ma_dvcs, @ma_ct, @ngay_ct, @ma_kh, @dien_giai, @t_tien2, @t_tien_nt2, @ma_thue, @thue_suat, @t_thue, @t_thue_nt, @ma_nt,@ma_nk, @detail";
                List<SqlParameter> paras = new List<SqlParameter>();

                var serializer = new JavaScriptSerializer();
                var json = serializer.Serialize(voucherInfo);

                #region add parameters
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@stt_rec",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.stt_rec
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_dvcs",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_dvcs
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_ct",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_ct
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ngay_ct",
                    SqlDbType = SqlDbType.DateTime,
                    Value = voucherInfo.ngay_ct
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_kh",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_kh
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@dien_giai",
                    SqlDbType = SqlDbType.NVarChar,
                    Value = voucherInfo.dien_giai
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@t_tien2",
                    SqlDbType = SqlDbType.Decimal,
                    Value = voucherInfo.t_tien
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@t_tien_nt2",
                    SqlDbType = SqlDbType.Decimal,
                    Value = voucherInfo.t_tien_nt
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_thue",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_thue
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@thue_suat",
                    SqlDbType = SqlDbType.Decimal,
                    Value = voucherInfo.thue_suat
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@t_thue",
                    SqlDbType = SqlDbType.Decimal,
                    Value = voucherInfo.t_thue
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@t_thue_nt",
                    SqlDbType = SqlDbType.Decimal,
                    Value = voucherInfo.t_thue_nt
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_nt",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_nt
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_nk",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_nk
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@detail",
                    SqlDbType = SqlDbType.NVarChar,
                    Value = serializer.Serialize(voucherInfo.details)
                });
                #endregion

                DataSet data =  SqlDataContext.ExecuteSQL(sql, paras);
                //Lấy dữ liệu chứng từ theo voucher id, tạo package data và gửi lên webservice/api của đơn vị phát hành
                ResponseInfo responses = invoice_service_HHM.CreateDraft(data);

                //Xử lý lưu thông tin kết quả phản hồi
                //invoice_service.SaveResponseInfo(responses);

                // nếu thành công thì thực hiện save vào bảng: ctgt20_hddt
                if (string.IsNullOrEmpty(responses.description) && string.IsNullOrEmpty(responses.errorCode))
                {
                    this.SaveDataInfo(data, voucherInfo);
                }

                //trả thông tin về client
                string result = JsonConvert.SerializeObject(responses);
                return responses;
            }
            return null;
        }

        /// <summary>
        /// Hàm xử lý gọi store lưu thông tin vào bảng ctgt20_hddt
        /// </summary>
        /// <param name="data"></param>
        private void SaveDataInfo(DataSet data, VoucherEntity voucherInfo)
        {
            if (data != null && data.Tables.Count >= 2)
            {
                string mau_hoa_don = data.Tables[1].Rows[0]["mau_hoa_don"].ToString().Trim();
                string so_seri = data.Tables[1].Rows[0]["so_seri"].ToString().Trim();

                string sql = "EXEC Genbyte$Data$Save$ctgt20_hddt @ma_ct, @stt_rec, @mau_hoa_don, @so_seri";
                List<SqlParameter> paras = new List<SqlParameter>();
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@ma_ct",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.ma_ct
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@stt_rec",
                    SqlDbType = SqlDbType.VarChar,
                    Value = voucherInfo.stt_rec
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@mau_hoa_don",
                    SqlDbType = SqlDbType.VarChar,
                    Value = mau_hoa_don ?? ""
                });
                paras.Add(new SqlParameter()
                {
                    ParameterName = "@so_seri",
                    SqlDbType = SqlDbType.VarChar,
                    Value = so_seri ?? ""
                });

                SqlDataContext.ExecuteSQL(sql, paras);
            }
        }

        /// <summary>
        /// Sửa thông tin hóa đơn nháp
        /// </summary>
        /// <param name="voucherIds"></param>
        /// <returns></returns>
        public ResponseInfo UpdateDraftInvoice(VoucherEntity voucherInfo)
        {
            string sql = "EXEC Genbyte$EInvoice$GetInvoiceInfo @stt_rec, @ma_dvcs, @ma_ct, @ngay_ct, @ma_kh, @dien_giai, @t_tien2, @t_tien_nt2, @ma_thue, @thue_suat, @t_thue, @t_thue_nt, @ma_nt,@ma_nk, @detail";
            List<SqlParameter> paras = new List<SqlParameter>();

            var serializer = new JavaScriptSerializer();
            var json = serializer.Serialize(voucherInfo);

            #region add parameters
            paras.Add(new SqlParameter()
            {
                ParameterName = "@stt_rec",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.stt_rec
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_dvcs",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_dvcs
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_ct",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_ct
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ngay_ct",
                SqlDbType = SqlDbType.DateTime,
                Value = voucherInfo.ngay_ct
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_kh",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_kh
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@dien_giai",
                SqlDbType = SqlDbType.NVarChar,
                Value = voucherInfo.dien_giai
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_tien2",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_tien
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_tien_nt2",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_tien_nt
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_thue",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_thue
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@thue_suat",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.thue_suat
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_thue",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_thue
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_thue_nt",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_thue_nt
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_nt",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_nt
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_nk",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_nk
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@detail",
                SqlDbType = SqlDbType.NVarChar,
                Value = serializer.Serialize(voucherInfo.details)
            });
            #endregion

            DataSet data = SqlDataContext.ExecuteSQL(sql, paras);
            ResponseInfo responses = invoice_service_HHM.UpdateDraft(data);

            //Xử lý lưu thông tin kết quả phản hồi

            invoice_service.SaveResponseInfo(responses);

            //trả thông tin về client
            string result = JsonConvert.SerializeObject(voucherInfo);
            return responses;

        }

        /// <summary>
        /// Download file PDF hóa đơn theo danh sách id chứng từ
        /// </summary>
        /// <param name="context"></param>
        /// <param name="voucherIds"></param>
        public ResponseInfo DownloadPDF(HttpContext context,VoucherEntity voucherInfo)
        {
            string sql = "EXEC Genbyte$EInvoice$GetInvoiceInfo @stt_rec, @ma_dvcs, @ma_ct, @ngay_ct, @ma_kh, @dien_giai, @t_tien2, @t_tien_nt2, @ma_thue, @thue_suat, @t_thue, @t_thue_nt, @ma_nt,@ma_nk, @detail";
            List<SqlParameter> paras = new List<SqlParameter>();

            var serializer = new JavaScriptSerializer();
            var json = serializer.Serialize(voucherInfo);
            #region add parameters
            paras.Add(new SqlParameter()
            {
                ParameterName = "@stt_rec",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.stt_rec
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_dvcs",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_dvcs
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_ct",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_ct
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ngay_ct",
                SqlDbType = SqlDbType.DateTime,
                Value = voucherInfo.ngay_ct
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_kh",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_kh
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@dien_giai",
                SqlDbType = SqlDbType.NVarChar,
                Value = voucherInfo.dien_giai
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_tien2",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_tien
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_tien_nt2",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_tien_nt
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_thue",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_thue
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@thue_suat",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.thue_suat
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_thue",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_thue
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@t_thue_nt",
                SqlDbType = SqlDbType.Decimal,
                Value = voucherInfo.t_thue_nt
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_nt",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_nt
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_nk",
                SqlDbType = SqlDbType.VarChar,
                Value = voucherInfo.ma_nk
            });
            paras.Add(new SqlParameter()
            {
                ParameterName = "@detail",
                SqlDbType = SqlDbType.NVarChar,
                Value = serializer.Serialize(voucherInfo.details)
            });
            #endregion

            DataSet data = SqlDataContext.ExecuteSQL(sql, paras);
            //Lấy dữ liệu PDF hóa đơn theo service của đơn vị phát hành
            ResponseInfo responses = invoice_service_HHM.GetInvoicePDF(data);
            string jsonResponse = JsonConvert.SerializeObject(responses);

            // Trả về chuỗi JSON
            return responses;
            //using (var compressedFileStream = new MemoryStream())
            //{
            //    //Create an archive and store the stream in memory.
            //    using (var zipArchive = new ZipArchive(compressedFileStream, ZipArchiveMode.Update, false))
            //    {
            //        {
            //            if (string.IsNullOrEmpty(responses.errorCode) && responses.fileToBytes != null)
            //            {
            //                //Create a zip entry for each attachment
            //                var zipEntry = zipArchive.CreateEntry(responses.fileName + ".pdf");

            //                //Get the stream of the attachment
            //                using (var originalFileStream = new MemoryStream(responses.fileToBytes))
            //                {
            //                    using (var zipEntryStream = zipEntry.Open())
            //                    {
            //                        //Copy the attachment stream to the zip entry stream
            //                        originalFileStream.CopyTo(zipEntryStream);
            //                    }
            //                }
            //            }
            //        }
            //    }
            //    try
            //    {
            //        //Xử lý cho phép client download dưới định dạng pdf
            //        HttpResponse httpResponse = context.Response;
            //        string fileNameZip = "HDDT_" + SupplierId + "_" + DateTime.Now.ToString();
            //        httpResponse.ClearContent();
            //        httpResponse.Clear();
            //        httpResponse.ContentType = "application/zip";
            //        httpResponse.AppendHeader("content-disposition", "attachment; filename=\"" + fileNameZip + ".zip\"");
            //        httpResponse.AddHeader("content-length", compressedFileStream.ToArray().Length.ToString());
            //        httpResponse.BufferOutput = true;
            //        httpResponse.BinaryWrite(compressedFileStream.ToArray());
            //        httpResponse.End();
            //        httpResponse.Flush();
            //        httpResponse.Close();
            //    }
            //    catch (Exception ex)
            //    {
            //        context.Response.Write(responses);
            //    }
            //}
        }

        /// <summary>
        /// Download file PDF hóa đơn theo danh sách id chứng từ
        /// </summary>
        /// <param name="context"></param>
        /// <param name="voucherIds"></param>
        public void DownloadPDF(HttpContext context, string voucherIds)
        {
            //Lấy dữ liệu PDF hóa đơn theo service của đơn vị phát hành
            List<ResponseInfo> responses = invoice_service.GetInvoicePDF(voucherIds);
            using (var compressedFileStream = new MemoryStream())
            {
                //Create an archive and store the stream in memory.
                using (var zipArchive = new ZipArchive(compressedFileStream, ZipArchiveMode.Update, false))
                {
                    foreach (ResponseInfo item in responses)
                    {
                        if (string.IsNullOrEmpty(item.errorCode) && item.fileToBytes != null){
                            //Create a zip entry for each attachment
                            var zipEntry = zipArchive.CreateEntry(item.fileName+".pdf");

                            //Get the stream of the attachment
                            using (var originalFileStream = new MemoryStream(item.fileToBytes))
                            {
                                using (var zipEntryStream = zipEntry.Open())
                                {
                                    //Copy the attachment stream to the zip entry stream
                                    originalFileStream.CopyTo(zipEntryStream);
                                }
                            }
                        }
                    }
                }
                try
                {
                    //Xử lý cho phép client download dưới định dạng pdf
                    HttpResponse httpResponse = context.Response;
                    string fileNameZip = "HDDT_" + SupplierId + "_" + DateTime.Now.ToString();
                    httpResponse.ClearContent();
                    httpResponse.Clear();
                    httpResponse.ContentType = "application/zip";
                    httpResponse.AppendHeader("content-disposition", "attachment; filename=\"" + fileNameZip + ".zip\"");
                    httpResponse.AddHeader("content-length", compressedFileStream.ToArray().Length.ToString());
                    httpResponse.BufferOutput = true;
                    httpResponse.BinaryWrite(compressedFileStream.ToArray());
                    httpResponse.End();
                    httpResponse.Flush();
                    httpResponse.Close();
                }
                catch (Exception ex)
                {
                    context.Response.Write(responses);
                }
            }
        }
        /// <summary>
        /// Cập nhật thông tin hóa đơn đã phát hành cho các chứng từ kế toán đã đẩy dữ liệu
        /// </summary>
        /// <param name="voucherIds"></param>
        public ResponseInfo GetPubInvInfo(string voucherId)
        {
            //Lấy dữ liệu hóa đơn điện tử đã phát hành
            ResponseInfo response = invoice_service_HHM.GetPublishedInvoiceHHM(voucherId);

            //Lấy user id từ session
            int user_id = 0;
            if (HttpContext.Current.Session["userID"] == null || !int.TryParse(HttpContext.Current.Session["userID"].ToString(), out user_id))
                return null;
            return response;
        }
        /// <summary>
        /// Lấy thông tin hóa đơn đã phát hành cho các chứng từ kế toán đã đẩy dữ liệu
        /// </summary>
        /// <param name="voucherIds"></param>
        public void MappingPubInvInfo(string voucherIds)
        {
            //Lấy dữ liệu hóa đơn điện tử đã phát hành
            List<ResponseInfo> responses = invoice_service.GetPublishedInvoice(voucherIds);

            //Lấy user id từ session
            int user_id = 0;
            if (HttpContext.Current.Session["userID"] == null || !int.TryParse(HttpContext.Current.Session["userID"].ToString(), out user_id))
                return;

            //thực hiện mapping thông tin vào chứng từ kế toán đối với các hóa đơn đã phát hành
            foreach (ResponseInfo item in responses)
            {
                if (item == null) continue;

                //Lưu lịch sử giao dịch
                DataController.SaveResponse(item);

                if (!string.IsNullOrEmpty(item.voucherId) && string.IsNullOrEmpty(item.errorCode)
                        && item.result != null && !string.IsNullOrEmpty(item.result.invoiceNo) && item.result.signedDate != null)
                {
                    string sql = "EXEC MOKA$EInvoice$MappingPublishedInv @supplierId, @voucherId, @transactionId, @reservationCode, @buyerTaxCode, @invoiceNo, @invoiceForm, @invoiceSerial, @invoiceDate, @signedDate, @status_v, @status_e, @userId";
                    List<SqlParameter> paras = new List<SqlParameter>();

                    #region add parameters
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@supplierId",
                        SqlDbType = SqlDbType.VarChar,
                        Value = this.SupplierId
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@voucherId",
                        SqlDbType = SqlDbType.Char,
                        Value = item.voucherId
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@transactionId",
                        SqlDbType = SqlDbType.VarChar,
                        Value = string.IsNullOrEmpty(item.result.transactionID) ? "" : item.result.transactionID
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@reservationCode",
                        SqlDbType = SqlDbType.VarChar,
                        Value = item.result.reservationCode ?? ""
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@buyerTaxCode",
                        SqlDbType = SqlDbType.VarChar,
                        Value = item.result.buyerTaxCode
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@invoiceNo",
                        SqlDbType = SqlDbType.VarChar,
                        Value = item.result.invoiceNo
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@invoiceForm",
                        SqlDbType = SqlDbType.VarChar,
                        Value = item.result.invoiceForm
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@invoiceSerial",
                        SqlDbType = SqlDbType.VarChar,
                        Value = item.result.invoiceSerial
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@invoiceDate",
                        SqlDbType = SqlDbType.DateTime,
                        Value = item.result.invoiceDate ?? null
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@signedDate",
                        SqlDbType = SqlDbType.NVarChar,
                        Value = item.result.signedDate ?? null
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@status_v",
                        SqlDbType = SqlDbType.NVarChar,
                        Value = item.result.status_v
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@status_e",
                        SqlDbType = SqlDbType.NVarChar,
                        Value = item.result.status_e
                    });
                    paras.Add(new SqlParameter()
                    {
                        ParameterName = "@userId",
                        SqlDbType = SqlDbType.Int,
                        Value = user_id
                    });
                    #endregion

                    SqlDataContext.ExecuteSQL(sql, paras);
                }
            }
        }

        public Dictionary<string, string> GetSerialInfo(string ma_nk)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            string sql = "select * from v20dmnk where ma_nk = @ma_nk";
            List<SqlParameter> paras = new List<SqlParameter>();

            #region add parameters
            paras.Add(new SqlParameter()
            {
                ParameterName = "@ma_nk",
                SqlDbType = SqlDbType.Char,
                Value = ma_nk
            });
            #endregion
            var dtset = SqlDataContext.ExecuteSQL(sql, paras);
            if (dtset.Tables.Count > 0 && dtset.Tables[0].Rows.Count > 0)
            {
                DataRow row = dtset.Tables[0].Rows[0];
                dic.Add("so_seri", row["so_seri"].ToString().Trim());
                dic.Add("ky_hieu", row["ky_hieu"].ToString().Trim());
            }
            return dic;
        }
    }
}

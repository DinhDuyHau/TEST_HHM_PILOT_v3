using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MokaOnline.EInvoiceHHM
{
    [Serializable]
    public class InvoiceAgr
    {
        public string VoucherIds { set; get; }

        public string SupplierId { set; get; }
    }

    public class VoucherEntity
    {
        public string stt_rec { get; set; }

        public string ma_ct { get; set; }

        public string so_ct { get; set; }

        public DateTime? ngay_ct { get; set; }

        public string ma_dvcs { get; set; }

        public string ma_cuahang { get; set; }
        public string ma_kh { get; set; }

        public string ma_ca { get; set; }

        public string status { get; set; }
        public string ma_nk { get; set; }
        public string dien_giai { get; set; }
        public string t_tien { get; set; }
        public string t_tien_nt { get; set; }
        public string ma_thue { get; set; }
        public decimal thue_suat { get; set; }
        public decimal t_thue { get; set; }
        public decimal t_thue_nt { get; set; }
        public string ma_nt { get; set; }

        public IList<VoucherDetail> details { get; set; }
    }
    public class VoucherDetail
    {
        public string stt_rec { get; set; }

        public string stt_rec0 { get; set; }

        public string ma_ct { get; set; }

        public DateTime? ngay_ct { get; set; }

        public string so_ct { get; set; }

        public string ma_cuahang { get; set; }

        public string ma_ca { get; set; }

        public decimal line_nbr { get; set; }

        public string ma_vt { get; set; }

        public string dvt { get; set; }

        public string ma_kho { get; set; }

        public string ma_khon { get; set; }

        public string ma_imei { get; set; }

        public decimal so_luong { get; set; }

        public decimal gia_nt { get; set; }

        public decimal tien_nt { get; set; }

        public string tk_vt { get; set; }

        public string tk_du { get; set; }

        public string ma_nx { get; set; }

        public bool px_gia_dd { get; set; }
        public decimal thue { get; set; }
        public int dv_yn { get; set; }
    }
}

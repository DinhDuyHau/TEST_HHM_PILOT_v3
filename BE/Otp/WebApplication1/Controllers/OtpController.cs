using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Numerics;
using Microsoft.Data.SqlClient;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OtpController : ControllerBase
    {

        private readonly string _connectionString;

        public OtpController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("SendOtp")]
        public async Task<IActionResult> SendOtp([FromQuery]string ma_kh, [FromQuery] string ngay_ct, [FromQuery]long so_diem)
        {
            string otp_code = "";
            DateTime expire_date;
            bool is_success = false;

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                SqlCommand cmd = new SqlCommand("Genbyte$SalePayment$GetPointOTP", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                List<SqlParameter> parameters = new List<SqlParameter>()
             {
                 new SqlParameter("@ma_kh", SqlDbType.VarChar) {Value = ma_kh},
                 new SqlParameter("@ngay_ct", SqlDbType.DateTime) {Value = DateTime.Parse(ngay_ct)},
                 new SqlParameter("@so_diem", SqlDbType.BigInt) {Value = so_diem},
             };
                cmd.Parameters.AddRange(parameters.ToArray());

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        is_success = (bool)reader["is_success"];
                        if (is_success)
                        {
                            otp_code = (string)reader["otp_code"];
                            expire_date = (DateTime)reader["expire_date"];
                        }
                    }
                }
            }

            if (is_success)
            {
                // send to zalo

                return Ok(new { is_success = true, otp_code });
            }

            return Ok(new { is_success = false });
        }

        [HttpGet("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp([FromQuery] string ma_kh, [FromQuery] string ma_otp)
        {
            bool is_valid = false;
            decimal so_diem = 0;
            decimal so_tien = 0;

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                SqlCommand cmd = new SqlCommand("Genbyte$SalePayment$CheckValidOTP", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                List<SqlParameter> parameters = new List<SqlParameter>()
             {
                 new SqlParameter("@ma_kh", SqlDbType.VarChar) {Value = ma_kh},
                 new SqlParameter("@ma_otp", SqlDbType.VarChar) {Value = ma_otp},
             };
                cmd.Parameters.AddRange(parameters.ToArray());


                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        is_valid = (bool)reader["is_valid"];
                        if (is_valid)
                        {
                            so_diem = (decimal)reader["so_diem"];
                            so_tien = (decimal)reader["so_tien"];
                        }
                    }
                }
            }

            if (is_valid)
            {
                return Ok(new { is_valid = true, so_diem, so_tien });
            }

            return Ok(new { is_valid = false });
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using VetDirectory.Models;
using System.Data;
using System.Data.SqlClient;
using System;


namespace VetDirectory.Services
{
    public class PatientService
    {
        private readonly IConfiguration _configuration;

        public PatientService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public JsonResult GetPatient(string partOfName = "")
        {
            if (partOfName == "")
            {
                return GetAll();
            }
            else
            {
                return SearchDatabaseByName(partOfName);
            }
        }

        public JsonResult GetAll()
        { 
            string query = @"SELECT patient_id, patient_name, date_of_birth, contact_number, email, diagnosis from dbo.Patients";

            DataTable dataTable = new DataTable();
            string dataSource = _configuration.GetConnectionString("VetDirectory");

            SqlDataReader reader = null;
            using (SqlConnection con = new SqlConnection(dataSource))
            {
                con.Open();
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    reader = command.ExecuteReader();
                    dataTable.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(dataTable);
        }

        public JsonResult SearchDatabaseByName(string partOfName)
        {
            string query = @"SELECT * from dbo.Patients WHERE patient_name LIKE '%'+@partOfName+'%'";

            DataTable dataTable = new DataTable();
            string dataSource = _configuration.GetConnectionString("VetDirectory");
            SqlDataReader reader = null;
            using (SqlConnection con = new SqlConnection(dataSource))
            {
                con.Open();
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@partOfName", partOfName);
                    reader = command.ExecuteReader();
                    dataTable.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(dataTable);
        }

        public JsonResult AddPatient(Patient patient)
        {
            string patientName = patient.Name;
            DateTime date = patient.DateOfBirth;
            string contactNumber = patient.ContactNumber;
            string email = patient.Email;
            string diagnosis = patient.Diagnosis;

            if (IsInTable(email)) return new JsonResult("User already in table");

            string query = @"insert into dbo.Patients
                                values (@patient_name, @date_of_birth, @contact_number, @email, @diagnosis);
                            select SCOPE_IDENTITY()";


            int insertedId = 0;

            string dataSource = _configuration.GetConnectionString("VetDirectory");
            using (SqlConnection con = new SqlConnection(dataSource))
            {
                con.Open();
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@patient_name", patientName);
                    command.Parameters.AddWithValue("@date_of_birth", date);
                    command.Parameters.AddWithValue("@contact_number", contactNumber);
                    command.Parameters.AddWithValue("@email", email);
                    command.Parameters.AddWithValue("@diagnosis", diagnosis);
                    object returnObj = command.ExecuteScalar();
                    if (returnObj != null)
                    {
                        int.TryParse(returnObj.ToString(), out insertedId);
                    }
                    command.Dispose();
                }
                con.Close();
            }

            return new JsonResult("Added successfully");
        }

        public JsonResult UpdatePatient(Patient patient, string diagnosis)
        {
            patient.Diagnosis = diagnosis;

            PatientService patientService = new PatientService(_configuration);
            patientService.AddPatient(patient);

            return new JsonResult("Added successfully");
        }

        public JsonResult DeletePatient(int id)
        {
            string findQuery = @"Select * from dbo.Patients where patient_id = @patientId";
            string dataSource = _configuration.GetConnectionString("VetDirectory");
            SqlDataReader findReader = null;
            bool message;
            using (SqlConnection con = new SqlConnection(dataSource))
            {
                con.Open();
                using (SqlCommand command = new SqlCommand(findQuery, con))
                {
                    command.Parameters.AddWithValue("@patientId", id);
                    findReader = command.ExecuteReader();
                    message = findReader.Read();
                    findReader.Close();
                    con.Close();
                }
            }
            if (message != true) throw new Exception("No such patient in Database");

            string query = @"delete from dbo.Patients
                           where patient_id = @patientId";
            SqlDataReader reader = null;
            using (SqlConnection con = new SqlConnection(dataSource))
            {
                con.Open();
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@patientId", id);
                    reader = command.ExecuteReader();
                    reader.Close();
                    con.Close();
                }
            }
            return new JsonResult("Deleted Successfully");
        }

        public bool IsInTable(string email)
        {
            string query = @"SELECT * FROM dbo.Patients
                            WHERE email=@email";

            bool inTable = false;
            string dataSource = _configuration.GetConnectionString("VetDirectory");

            using (SqlConnection con = new SqlConnection(dataSource))
            {
                con.Open();
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@email", email);
                    object o = command.ExecuteScalar();
                    inTable = ((o == null) || (o == DBNull.Value)) ? false :
                                                (int)o == 0 ? false : true;
                    command.Dispose();
                    con.Close();
                }
            }
            return inTable;
        }
    }
}

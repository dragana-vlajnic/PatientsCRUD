using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using VetDirectory.Models;
using VetDirectory.Services;

namespace VetDirectory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private PatientService _patientService;

        public PatientController(IConfiguration configuration)
        {
            _patientService = new PatientService(configuration);
        }

        [HttpGet]
        public JsonResult GetPatient(string partOfName = "")
        {
            return _patientService.GetPatient(partOfName);
        }

        [HttpPost("{patients}")]
        public JsonResult AddPatient(Patient patient)
        {
            return _patientService.AddPatient(patient);
        }

        [HttpPut("{patients}")]
        public JsonResult UpdatePatient(Patient patient, string diagnosis)
        {
            return _patientService.UpdatePatient(patient, diagnosis);
        }

        [HttpDelete]
        public JsonResult DeletePatient(int id)
        {
            return _patientService.DeletePatient(id);
        }
    }
}

const fs = require('fs');
const path = require('path');
const _ = require('lodash')

const outputDir = path.join(__dirname, 'src/hospital');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}


fetch("https://prac360-dev.agamvanigam.com/v3/home/getall/hospitals")
    .then( res => {
        return res.json()
    })
    .then(data => {
        data.forEach(async (hospital)  => {
            const hospitalDetails =await fetch(`https://prac360-dev.agamvanigam.com/v3/home/hospital/details/${hospital._id}`)
            .then( res => {
                return res.json()
            })
            const mdContent = 
`---
profilePic : ${_.isEmpty(hospital.logo) ? "https://firebasestorage.googleapis.com/v0/b/dr-appointment-booking-app.appspot.com/o/ForPrac360%2Flogo.jpeg?alt=media&token=2a711c2b-50d4-4a92-aedf-f873c8e05df3&_gl=1*6dobye*_ga*MjEwMTU2OTQ5NC4xNjY3NDYyMDE4*_ga_CW55HF8NVT*MTY5ODUxMjcwNS4yNjAuMS4xNjk4NTEyNzIyLjQzLjAuMA..String" : hospital.logo}
name: ${hospital.name}
details: ${hospital.details}
location: ${hospital.areaId.name}
specialities: ${hospitalDetails.specialities}
doctors: ${hospitalDetails.doctors}
services: ${hospitalDetails.services}
_id: ${hospital._id}
doctorsInHospital: /doctorsInHospital/${hospital.name.replace(/\s+/g,'').toLowerCase()}/
---`;       

            const docInHosDrc = path.join(__dirname,`src/doctorsInHospital`)
            if (!fs.existsSync(docInHosDrc)) {
                fs.mkdirSync(docInHosDrc, { recursive: true });
            }
            const docInHosFilePath = path.join(docInHosDrc,`${hospital.name.replace(/\s+/g,'').toLowerCase()}.html`)

            if(!fs.existsSync(docInHosFilePath)){
    
            let doctorList = ''
            for(let i of hospitalDetails.doctorList){
                const data = `<div class="doctor-profile">
        <img src=" ${_.isEmpty(i.profileId?.profilePic) ? "https://firebasestorage.googleapis.com/v0/b/dr-appointment-booking-app.appspot.com/o/ForPrac360%2Flogo.jpeg?alt=media&token=2a711c2b-50d4-4a92-aedf-f873c8e05df3&_gl=1*6dobye*_ga*MjEwMTU2OTQ5NC4xNjY3NDYyMDE4*_ga_CW55HF8NVT*MTY5ODUxMjcwNS4yNjAuMS4xNjk4NTEyNzIyLjQzLjAuMA..String" : i.profileId?.profilePic}" alt="Doctor Image" width="150" height="180">
        <div class="doctor-details">
            <h2><strong>${i.profileId.name}</strong></h2>
            <p class="specialties"><strong>${i.specialties}</strong></p><br>
            <p class="description"><small>${!_.isEmpty(i.description) ? i.description : ''}</small></p>
            <div class="info">
                <p><span class="label">Experience of Years:</span> ${!_.isEmpty(i.yearsOfExp) ? i.yearsOfExp : ''}</p><br>
                <p><span class="label">Available Location:</span>${i.hospitalId.areaId.name}</p><br>
                <p><span class="label">Contact Number:</span>${!_.isEmpty(i.profileId.contactNo) ? i.profileId.contactNo : ''}</p><br>
            </div>
            <div class="buttons">
                <a href="https://play.google.com/store/apps/details?id=com.agamworks.prac360" class="book-appointment">Book an Appointment</a>
            </div>
        </div>
    </div>`
            doctorList +=data     
            }

            const html =
`--- 
layout: template.html
---

<div class="container max-w-3xl " style="margin-top: 20px; margin-bottom: 100px;">

    <div class="doctor-list">
        <div class="container max-w-3xl pt-5" style="margin-top: 150px;" >

            <h1 class="font-bold" style="color: black; font-weight: 600;">${hospital.name}</h1>
        
        </div>
    ${_.isEmpty(doctorList) ? "-- No Doctors --" : doctorList}
    </div>

    
    <style>
        .mt-15 { margin-top: 15px; }
        body {
            font-family: Arial, sans-serif;
        }
        .doctor-profile {
            display: flex;
            border: 1px solid #ccc;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
        }
        .doctor-profile img {
            border-radius: 8px;
            margin-right: 20px;
        }
        .doctor-details {
            padding: 15px 0;
            flex: 1;
        }
        .doctor-details h2 {
            margin: 0;
            font-size: 24px;
        }
        .doctor-details p {
            margin: 5px 0;
            display: inline-block;
            margin-right: 10px;
        }
        .doctor-details .description {
            font-weight: 400;
        }
        .doctor-details .specialties {
            color: #666;
        }
        .info p {
        font-weight: bold;
        margin: 5px 0;
        }
        .label {
            color: #666;
            font-weight: 100;
            display: inline-block;
            margin-right: 10px;
        }
        .doctor-details .buttons {
            margin-top: 10px;
        }
        .doctor-details .buttons a {
            text-decoration: none;
            margin-right: 10px;
            padding: 10px 15px;
            border-radius: 5px;
        }
        .view-profile {
            float: right;
            color: #007bff;
        }
        .book-appointment {
            float: right;
            background-color: #007bff;
            color: white;
        }
        .doctor-list {
            max-width: 1000px;
            margin: 0 auto;
        }
    </style>
</div>
`
        fs.writeFileSync(docInHosFilePath,html.trim())
        console.log(`Doctor In Hospital Created ${docInHosFilePath}`)

        }
            const fileName = `${hospital.name.replace(/\s+/g,'').toLowerCase()}_${hospital._id}.md`;
            const filePath = path.join(outputDir, fileName);
            if(!fs.existsSync(filePath)){
                fs.writeFileSync(filePath, mdContent.trim());
                console.log(`Hosptial Created ${filePath}`);
            }
        });
}).catch(error => console.log(error))

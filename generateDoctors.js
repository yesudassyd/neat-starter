const fs = require('fs');
const path = require('path');
const _ = require('lodash')

const outputDir = path.join(__dirname, 'src/doctor');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}


fetch("https://prac360-dev.agamvanigam.com/v3/home/getall/doctors")
    .then( res => {
        return res.json()
    })
    .then(data => {
        data.forEach(doctor => {
            const mdContent = 
`---
layout: doctor
profilePic : ${_.isEmpty(doctor.profileId.profilePic) ? "https://firebasestorage.googleapis.com/v0/b/dr-appointment-booking-app.appspot.com/o/ForPrac360%2Flogo.jpeg?alt=media&token=2a711c2b-50d4-4a92-aedf-f873c8e05df3&_gl=1*6dobye*_ga*MjEwMTU2OTQ5NC4xNjY3NDYyMDE4*_ga_CW55HF8NVT*MTY5ODUxMjcwNS4yNjAuMS4xNjk4NTEyNzIyLjQzLjAuMA..String" : doctor.profileId.profilePic}
title: ${doctor.profileId.name}
specialties: ${doctor.specialties}
description: ${doctor.description}
yearsOfExp: ${doctor.yearsOfExp}
location: ${doctor.hospitalId.areaId.name}
contact: ${doctor.profileId.contactNo}
hospitalName: ${doctor.hospitalId.name}
avl_days: ${doctor.hospitalId.address}
_id: ${doctor._id}
---`;       
            const fileName = `${doctor.profileId.name.replace(/\s+/g,'').toLowerCase()}_${doctor._id}.md`;
            const filePath = path.join(outputDir, fileName);
            if(!fs.existsSync(filePath)){
                fs.writeFileSync(filePath, mdContent.trim());
                console.log(`Doctor Created ${filePath}`);
            }
        });
}).catch(error => console.log(error))

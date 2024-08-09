const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'src/doctor');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}


fetch("https://prac360-dev.agamvanigam.com/v3/doctor/getall")
    .then( res => {
        return res.json()
    })
    .then(data => {
        data.forEach(doctor => {
            const mdContent = 
`---
layout: doctor
profilePic : ${doctor.profileId.profilePic}
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
                console.log(`Created ${filePath}`);
            }
        });
}).catch(error => console.log(error))

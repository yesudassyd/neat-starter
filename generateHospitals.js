const fs = require('fs');
const path = require('path');

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
            const hospitalResource =await fetch(`https://prac360-dev.agamvanigam.com/v3/home/hospital/resource/${hospital._id}`)
            .then( res => {
                return res.json()
            })
            const mdContent = 
`---
profilePic : ${hospital.logo}
name: ${hospital.name}
details: ${hospital.details}
location: ${hospital.areaId.name}
specialities: ${hospitalResource.specialities}
doctors: ${hospitalResource.doctors}
services: ${hospitalResource.services}
_id: ${hospital._id}
---`;       
            const fileName = `${hospital.name.replace(/\s+/g,'').toLowerCase()}_${hospital._id}.md`;
            const filePath = path.join(outputDir, fileName);
            if(!fs.existsSync(filePath)){
                fs.writeFileSync(filePath, mdContent.trim());
                console.log(`Hosptial Created ${filePath}`);
            }
        });
}).catch(error => console.log(error))

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'src/doctor');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}


fetch("https://66a8d49ee40d3aa6ff5996ab.mockapi.io/doctors")
    .then( res => {
        return res.json()
    })
    .then(data => {
        data.forEach(doctor => {
            const mdContent = `
        ---
        title: ${doctor.name}
        id: ${doctor.id}
        createdAt: ${doctor.createdAt}
        ---

        # ${doctor.name}

        - **ID**: ${doctor.id}
        - **Created At**: ${doctor.createdAt}
            `;

            const fileName = `${doctor.name.replace(/\s+/g, '_').toLowerCase()}.md`;
            const filePath = path.join(outputDir, fileName);

            fs.writeFileSync(filePath, mdContent.trim());
            console.log(`Created ${filePath}`);
        });
}).catch(error => console.log(error))

import { spawn } from "child_process"

const project = process.argv[2] 

if (!project) {
    console.log("Usage: node run-project p1-notes-system")
    process.exit(1)
}

const backendPath = `projects/${project}/backend/server.js`
const frontendPath = `projects/${project}/frontend`

console.log(`Starting project: ${project}`)

// start backend
// import(`./projects/${project}/backend/server.js`)
//     .then(module => module.startServer())
//     .catch(err => console.error(err))
const backend = spawn("nodemon", [backendPath], {
    stdio: "inherit",
})


// start frontend (vite dev server)
const frontend = spawn("npm", ["run", "dev"], {
    cwd: frontendPath,
    stdio: "inherit",
})



frontend.on("close", code => {
    console.log("Frontend stopped")
})

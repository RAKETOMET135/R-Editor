import { Explorer, ExplorerElement } from "./assets/editor_windows/explorer.js"
import { ObjectData } from "./assets/editor_windows/object_data.js"
import { Object } from "./assets/objects/object.js"
import { ProjectData } from "./assets/project_data/project_data.js"
import { SceneHandler } from "./assets/editor_windows/scene_handler.js"
import { RunHandler } from "./assets/editor_windows/run_handler.js"


function getProject(){
    const project = new ProjectData("Test project")

    return project
}

function main(){
    const project = getProject()

    const sceneElement = document.querySelector("#scene")
    const sceneHandler = new SceneHandler(sceneElement)
    const runHandler = new RunHandler(sceneHandler, project)

    const explorerRenderDiv = document.querySelector("#explorer")
    const explorer = new Explorer(explorerRenderDiv, project, sceneHandler)
    const objectDataRenderDiv = document.querySelector("#object-data")
    const objectData = new ObjectData(explorer, objectDataRenderDiv, project, sceneHandler)
    

    explorer.objectData = objectData

    const addObjectButton = document.querySelector("#add-object")
    addObjectButton.addEventListener("click", () => {
        let newObjectId = project.generateObjectId()
        let newObject = new Object("Object", newObjectId)
        let explorerObject = new ExplorerElement(newObject.name, newObjectId, "assets/images/web/container.png", NaN, "Scene 1", newObject)

        explorer.addElement(explorerObject)
        project.objects.push(newObject)

        sceneHandler.updateObjectRender(newObject)
    })

    const runButton = document.querySelector("#run")
    const pauseButton = document.querySelector("#pause")

    runButton.style.borderColor = "green"
    runButton.addEventListener("mouseover", () => {
        runButton.style.backgroundColor = runButton.style.borderColor
    })
    runButton.addEventListener("mouseout", () => {
        runButton.style.backgroundColor = "var(--main-background-color)"
    })
    runButton.addEventListener("click", () => {
        runButton.style.transition = "none"

        if (!runHandler.runState && !runHandler.paused){
            runHandler.runScene()
            runButton.innerText = "Stop"
            runButton.style.borderColor = "red"
        }
        else{
            runHandler.stopScene()
            runButton.innerText = "Run"
            runButton.style.borderColor = "green"
            pauseButton.innerText = "Pause"
        }

        runButton.style.backgroundColor = runButton.style.borderColor
        setTimeout(() => {
            runButton.style.transition = "background-color 0.3s"
        }, 10)
    })

    pauseButton.style.borderColor = "orange"
    pauseButton.addEventListener("mouseover", () => {
        pauseButton.style.backgroundColor = pauseButton.style.borderColor
    })
    pauseButton.addEventListener("mouseout", () => {
        pauseButton.style.backgroundColor = "var(--main-background-color)"
    })
    pauseButton.addEventListener("click", () => {
        if (runHandler.paused){
            runHandler.puaseScene(false)
            pauseButton.innerText = "Pause"
        }
        else if (runHandler.runState){
            runHandler.puaseScene(true)
            pauseButton.innerText = "Resume"
        }
    })
    

    
}

main()
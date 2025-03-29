import { Explorer, ExplorerElement } from "./assets/editor_windows/explorer.js"
import { ObjectData } from "./assets/editor_windows/object_data.js"
import { Object } from "./assets/objects/object.js"
import { ProjectData } from "./assets/project_data/project_data.js"
import { SceneHandler } from "./assets/editor_windows/scene_handler.js"

function getProject(){
    const project = new ProjectData("Test project")

    return project
}

function main(){
    const project = getProject()

    const sceneElement = document.querySelector("#scene")
    const sceneHandler = new SceneHandler(sceneElement)

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
    

    
}

main()
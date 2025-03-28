import { Explorer, ExplorerElement } from "./assets/editor_windows/explorer.js"
import { ObjectData } from "./assets/editor_windows/object_data.js"
import { Object } from "./assets/objects/object.js"
import { ProjectData } from "./assets/project_data/project_data.js"

function getProject(){
    const project = new ProjectData("Test project")

    return project
}

function main(){
    const project = getProject()

    const explorerRenderDiv = document.querySelector("#explorer")
    const explorer = new Explorer(explorerRenderDiv, project)
    const objectDataRenderDiv = document.querySelector("#object-data")
    const objectData = new ObjectData(explorer, objectDataRenderDiv, project)

    explorer.objectData = objectData

    const addObjectButton = document.querySelector("#add-object")
    addObjectButton.addEventListener("click", () => {
        let newObjectId = project.generateObjectId()
        let newObject = new Object("Object", newObjectId)
        let explorerObject = new ExplorerElement(newObject.name, newObjectId, "assets/images/web/container.png", NaN, "Scene 1", newObject)

        explorer.addElement(explorerObject)
        project.objects.push(newObject)
    })
    

    let playerObject = new Object("Player", 0)
    let player = new ExplorerElement(playerObject.name, playerObject.id, "assets/images/web/container.png", NaN, "Scene 1", playerObject)
    explorer.addElement(player)
    project.objects.push(playerObject)

    
}

main()
import { Object } from "../objects/object.js"
import { StringConverter } from "../utils/string_converter.js"
import { getAllData } from "../editor_data/object_data_list.js"

export class ObjectData{
    constructor(explorer, objectDataRenderDiv, project){
        this.explorer = explorer
        this.objectDataRenderDiv = objectDataRenderDiv
        this.project = project
    }

    clearObjectData(){
        while (this.objectDataRenderDiv.children.length > 0){
            this.objectDataRenderDiv.firstChild.remove()
        }

        const menu = document.querySelector("#object-data-new-data")
        menu.style.display = "none"
    }

    renameObject(object, newObjectName, selectedObject){
        if (object.id < 0){
            
        }
        else{
            this.project.changeObjectName(object.id, newObjectName)

            selectedObject.name = newObjectName
            this.explorer.render()
        }
    }

    createMainData(object, selectedObject){
        const holder = document.createElement("div")
        holder.style.height = "10em"

        const header = document.createElement("h2")
        header.innerText = "Main data"

        const name = document.createElement("div")
        name.style.height = "2em"
        name.style.backgroundColor = "var(--main-background-color)"
        name.style.marginTop = "2.25rem"
        name.style.display = "flex"
        name.style.flexDirection = "row"

        const nameHeader = document.createElement("p")
        nameHeader.innerText = "Name"
        nameHeader.style.width = "50%"
        name.append(nameHeader)

        const nameValue = document.createElement("input")
        nameValue.value = object.name
        nameValue.style.width = "50%"
        name.append(nameValue)

        nameValue.addEventListener("input", () => {
            this.renameObject(object, nameValue.value, selectedObject)
        })

        const tag = document.createElement("div")
        tag.style.height = "2em"
        tag.style.backgroundColor = "var(--main-background-color)"
        tag.style.marginTop = "0.5rem"
        tag.style.display = "flex"
        tag.style.flexDirection = "row"

        const tagHeader = document.createElement("p")
        tagHeader.innerText = "Tag"
        tagHeader.style.width = "50%"
        tag.append(tagHeader)

        const tagValue = document.createElement("input")
        tagValue.value = object.tag
        tagValue.style.width = "50%"
        tag.append(tagValue)

        tagValue.addEventListener("input", () => {
            object.tag = tagValue.value
        })

        const objectId = document.createElement("p")
        objectId.innerText = `Id: ${object.id}`
        objectId.style.marginTop = "0.5rem"

        holder.append(header)
        holder.append(name)
        holder.append(tag)
        holder.append(objectId)

        return holder
    }

    appendNewDataMenu(search){
        const holder = document.querySelector("#all-object-data")
        
        while (holder.children.length > 0){
            holder.firstChild.remove()
        }

        const allData = getAllData()

        for (let i = 0; i < allData.length; i++){
            const data = allData[i]

            const dataButton = document.createElement("button")
            dataButton.innerText = data
            holder.append(dataButton)
        }
    }

    createNewDataButton(){
        const newDataButton = document.createElement("button")
        newDataButton.innerText = "Add data"
        newDataButton.style.marginTop = "0.5rem"
        newDataButton.style.width = "calc(95% - 2px)"
        newDataButton.style.marginLeft = "2.5%"
        newDataButton.style.left = "0"
        newDataButton.style.top = "0"

        newDataButton.addEventListener("click", () => {
            const menu = document.querySelector("#object-data-new-data")
            menu.style.display = "flex"
            
            const computedButtonStyle = window.getComputedStyle(newDataButton)
            const rect = newDataButton.getBoundingClientRect()
            const width = StringConverter.floatFromPixelString(computedButtonStyle.width)

            menu.style.width = `${width}px`
            menu.style.height = `${width}px`
            menu.style.left = `${rect.left}px`
            menu.style.top = `${rect.top}px`

            this.appendNewDataMenu("")
        })

        return newDataButton
    }

    renderSelectedObjectData(selectedObject){
        this.clearObjectData()

        let object = selectedObject.object

        if (!object){
            object = new Object(this.explorer.selectedElement.name, -1)
        }

        let mainData = this.createMainData(object, selectedObject)
        this.objectDataRenderDiv.append(mainData)

        let newDataButton = this.createNewDataButton()
        this.objectDataRenderDiv.append(newDataButton)
    }

    onObjectSelected(){
        let selectedObject = this.explorer.selectedElement

        if (selectedObject){
            this.renderSelectedObjectData(selectedObject)
        }
        else{
            this.clearObjectData()
        }
    }
}
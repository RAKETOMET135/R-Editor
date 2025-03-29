import { Object } from "../objects/object.js"
import { StringConverter } from "../utils/string_converter.js"
import { getAllData } from "../editor_data/object_data_list.js"

export class ObjectData{
    constructor(explorer, objectDataRenderDiv, project, sceneHandler){
        this.explorer = explorer
        this.objectDataRenderDiv = objectDataRenderDiv
        this.project = project
        this.sceneHandler = sceneHandler

        const objectDataSearch = document.querySelector("#object-data-search")
        objectDataSearch.addEventListener("input", () => {
            this.appendNewDataMenu(objectDataSearch.value)
        })

        const objectDataAddClose = document.querySelector("#object-data-add-close")
        objectDataAddClose.addEventListener("click", () => {
            const menu = document.querySelector("#object-data-new-data")
            menu.style.display = "none"
        })
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

        search = search.toLowerCase()

        for (let i = 0; i < allData.length; i++){
            const data = allData[i]
            
            if (!data.toLowerCase().includes(search)) continue

            const dataButton = document.createElement("button")
            dataButton.innerText = data
            holder.append(dataButton)

            dataButton.addEventListener("click", () => {
                let selectedObject = this.explorer.selectedElement
                
                if (!selectedObject) return

                let dataConstruct = [data, []]

                selectedObject.object.addData(dataConstruct)

                this.renderSelectedObjectData(selectedObject)

                this.sceneHandler.updateObjectRender(selectedObject.object)
            })
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
            //menu.style.left = `${rect.left}px`
            //menu.style.top = `${rect.top}px`
            menu.style.left = "50%"
            menu.style.top = "50%"
            menu.style.translate = "-50% -50%"

            this.appendNewDataMenu("")
        })

        return newDataButton
    }

    updateRender(object){
        this.sceneHandler.updateObjectRender(object)
    }

    removeObjectData(object, selectedObject, data){
        object.removeData(data)
        this.updateRender(object)
        this.renderSelectedObjectData(selectedObject)
    }

    createSpecData(object, selectedObject, data){
        const holder = document.createElement("div")
        const header = document.createElement("h2")
        const removeButton = document.createElement("button")
        const resetButton = document.createElement("button")

        header.innerText = data[0]
        holder.append(header)
        holder.append(removeButton)
        holder.append(resetButton)

        removeButton.style.width = "1.9rem"
        removeButton.style.height = "1.9rem"
        removeButton.style.right = "0"
        removeButton.style.position = "absolute"
        removeButton.innerText = "X"

        removeButton.addEventListener("click", () => {
            this.removeObjectData(object, selectedObject, data)
        })

        resetButton.style.width = "1.9rem"
        resetButton.style.height = "1.9rem"
        resetButton.style.right = "1.9rem"
        resetButton.style.position = "absolute"
        resetButton.innerText = "↻"

        resetButton.addEventListener("click", () => {
            data[1] = []
            this.renderSelectedObjectData(selectedObject)
            this.updateRender(object)
        })

        if (data[0] === "Transform"){
            holder.style.height = "20em"

            if (data[1].length === 0){
                data[1].push([0, 0, 0])
                data[1].push([0, 0, 0])
                data[1].push([1, 1, 1])
                data[1].push([0, 0, 0])
            }

            const positionHeader = document.createElement("p")
            positionHeader.innerText = "Position"
            positionHeader.style.marginTop = "2.25rem"
            holder.append(positionHeader)

            const positionHolder = document.createElement("div")
            positionHolder.style.height = "2em"
            positionHolder.style.backgroundColor = "var(--main-background-color)"
            positionHolder.style.marginTop = "0.5rem"
            positionHolder.style.display = "flex"
            positionHolder.style.flexDirection = "row"
            holder.append(positionHolder)

            for (let i = 0; i < 3; i++){
                const pos = document.createElement("input")
                pos.value = data[1][0][i]
                pos.style.width = "33%"
                positionHolder.append(pos)

                pos.addEventListener("input", () => {
                    let userInput = pos.value
                    let numberValue = parseFloat(userInput)

                    if (numberValue || numberValue === 0){
                        data[1][0][i] = numberValue
                        this.updateRender(object)
                    }
                })
            }

            const rotationHeader = document.createElement("p")
            rotationHeader.innerText = "Rotation"
            rotationHeader.style.marginTop = "0.5rem"
            holder.append(rotationHeader)

            const rotationHolder = document.createElement("div")
            rotationHolder.style.height = "2em"
            rotationHolder.style.backgroundColor = "var(--main-background-color)"
            rotationHolder.style.marginTop = "0.5rem"
            rotationHolder.style.display = "flex"
            rotationHolder.style.flexDirection = "row"
            holder.append(rotationHolder)
            
            for (let i = 0; i < 3; i++){
                const rot = document.createElement("input")
                rot.value = data[1][1][i]
                rot.style.width = "33%"
                rotationHolder.append(rot)

                rot.addEventListener("input", () => {
                    let userInput = rot.value
                    let numberValue = parseFloat(userInput)

                    if (numberValue || numberValue === 0){
                        data[1][1][i] = numberValue
                        this.updateRender(object)
                    }
                })
            }

            const scaleHeader = document.createElement("p")
            scaleHeader.innerText = "Scale"
            scaleHeader.style.marginTop = "0.5rem"
            holder.append(scaleHeader)

            const scaleHolder = document.createElement("div")
            scaleHolder.style.height = "2em"
            scaleHolder.style.backgroundColor = "var(--main-background-color)"
            scaleHolder.style.marginTop = "0.5rem"
            scaleHolder.style.display = "flex"
            scaleHolder.style.flexDirection = "row"
            holder.append(scaleHolder)

            for (let i = 0; i < 3; i++){
                const scale = document.createElement("input")
                scale.value = data[1][2][i]
                scale.style.width = "33%"
                scaleHolder.append(scale)

                scale.addEventListener("input", () => {
                    let userInput = scale.value
                    let numberValue = parseFloat(userInput)

                    if (numberValue || numberValue === 0){
                        data[1][2][i] = numberValue
                        this.updateRender(object)
                    }
                })
            }

            const translateHeader = document.createElement("p")
            translateHeader.innerText = "Translation"
            translateHeader.style.marginTop = "0.5rem"
            holder.append(translateHeader)

            const translateHolder = document.createElement("div")
            translateHolder.style.height = "2em"
            translateHolder.style.backgroundColor = "var(--main-background-color)"
            translateHolder.style.marginTop = "0.5rem"
            translateHolder.style.display = "flex"
            translateHolder.style.flexDirection = "row"
            holder.append(translateHolder)

            for (let i = 0; i < 3; i++){
                const translate = document.createElement("input")
                translate.value = data[1][3][i]
                translate.style.width = "33%"
                translateHolder.append(translate)

                translate.addEventListener("input", () => {
                    let userInput = translate.value
                    let numberValue = parseFloat(userInput)

                    if (numberValue || numberValue === 0){
                        data[1][3][i] = numberValue
                        this.updateRender(object)
                    }
                })
            }
        }
        else if (data[0] === "Image"){
            holder.style.height = "20em"

            if (data[1].length === 0){
                data[1].push([0, 0])
                data[1].push("")
                data[1].push(0)
                data[1].push("auto")
            }

            const sizeHeader = document.createElement("p")
            sizeHeader.innerText = "Size"
            sizeHeader.style.marginTop = "2.25rem"
            holder.append(sizeHeader)

            const sizeHolder = document.createElement("div")
            sizeHolder.style.height = "2em"
            sizeHolder.style.backgroundColor = "var(--main-background-color)"
            sizeHolder.style.marginTop = "0.5rem"
            sizeHolder.style.display = "flex"
            sizeHolder.style.flexDirection = "row"
            holder.append(sizeHolder)

            for (let i = 0; i < 2; i++){
                const size = document.createElement("input")
                size.value = data[1][0][i]
                size.style.width = "50%"
                sizeHolder.append(size)

                size.addEventListener("input", () => {
                    let userInput = size.value
                    let numberValue = parseFloat(userInput)

                    if (numberValue || numberValue === 0){
                        data[1][0][i] = numberValue
                        this.updateRender(object)
                    }
                })
            }

            const imgHeader = document.createElement("p")
            imgHeader.innerText = "URL"
            imgHeader.style.marginTop = "0.5rem"
            holder.append(imgHeader)

            const imgHolder = document.createElement("div")
            imgHolder.style.height = "2em"
            imgHolder.style.backgroundColor = "var(--main-background-color)"
            imgHolder.style.marginTop = "0.5rem"
            imgHolder.style.display = "flex"
            imgHolder.style.flexDirection = "row"
            holder.append(imgHolder)

            const img = document.createElement("input")
            img.value = data[1][1]
            img.style.width = "100%"
            imgHolder.append(img)

            img.addEventListener("input", () => {
                let userInput = img.value

                data[1][1] = userInput
                this.updateRender(object)
            })

            const transparencyHeader = document.createElement("p")
            transparencyHeader.innerText = "Transparency"
            transparencyHeader.style.marginTop = "0.5rem"
            holder.append(transparencyHeader)

            const transparencyHolder = document.createElement("div")
            transparencyHolder.style.height = "2em"
            transparencyHolder.style.backgroundColor = "var(--main-background-color)"
            transparencyHolder.style.marginTop = "0.5rem"
            transparencyHolder.style.display = "flex"
            transparencyHolder.style.flexDirection = "row"
            holder.append(transparencyHolder)

            const transparency = document.createElement("input")
            transparency.value = data[1][2]
            transparency.style.width = "100%"
            transparencyHolder.append(transparency)

            transparency.addEventListener("input", () => {
                let userInput = transparency.value
                let numberValue = parseFloat(userInput)

                if (numberValue || numberValue === 0){
                    data[1][2] = userInput
                    this.updateRender(object)
                }
            })

            const renderingHeader = document.createElement("p")
            renderingHeader.innerText = "Rendering"
            renderingHeader.style.marginTop = "0.5rem"
            holder.append(renderingHeader)

            const renderingHolder = document.createElement("div")
            renderingHolder.style.height = "2em"
            renderingHolder.style.backgroundColor = "var(--main-background-color)"
            renderingHolder.style.marginTop = "0.5rem"
            renderingHolder.style.display = "flex"
            renderingHolder.style.flexDirection = "row"
            holder.append(renderingHolder)

            const rendering = document.createElement("select")
            rendering.style.width = "100%"
            renderingHolder.append(rendering)
            const optionsText = ["auto", "crisp-edges", "optimizeQuality", "optimizeSpeed", "pixelated"]

            for (let i = 0; i < optionsText.length; i++){
                const option = document.createElement("option")
                option.value = optionsText[i]
                option.innerText = optionsText[i]
                option.style.textAlign = "center"
                rendering.append(option)

                if (optionsText[i] === data[1][3]){
                    option.selected = true
                }
            }

            rendering.addEventListener("change", (event) => {
                let userInput = event.target.value

                data[1][3] = userInput
                this.updateRender(object)
            })
            
        }

        return holder
    }

    renderSelectedObjectData(selectedObject){
        this.clearObjectData()

        let object = selectedObject.object

        if (!object){
            object = new Object(this.explorer.selectedElement.name, -1)
        }

        let mainData = this.createMainData(object, selectedObject)
        this.objectDataRenderDiv.append(mainData)

        for (let i = 0; i < object.data.length; i++){
            const data = object.data[i]

            let dataHTML = this.createSpecData(object, selectedObject, data)
            this.objectDataRenderDiv.append(dataHTML)
        }

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
import { Object, cloneObject } from "../objects/object.js"

export class ExplorerElement{
    constructor(elementName, elementId, elementType, elementParent, scene, object){
        this.name = elementName
        this.id = elementId
        this.elementType = elementType
        this.parent = elementParent
        this.scene = scene
        this.folded = false
        this.selected = false
        this.object = object
    }
}

export class Explorer{
    constructor(renderDiv, project, sceneHandler){
        this.content = []
        this.renderDiv = renderDiv
        this.selectedElement = NaN
        this.selectedElementHtml = NaN
        this.objectData = NaN
        this.contextMenuSelected = NaN
        this.contextMenuSelectedHtml = NaN
        this.project = project
        this.sceneHandler = sceneHandler

        document.body.addEventListener("click", () => {
            const contextMenu = document.querySelector("#explorer-contextmenu")

            if (this.contextMenuSelectedHtml && contextMenu.style.display === "none"){
                this.setElementInput(false)
            }

            contextMenu.style.display = "none"
        })
        document.body.addEventListener("keydown", (event) => {
            if (event.key === "Enter"){
                if (this.contextMenuSelectedHtml){
                    this.setElementInput(false)
                }
            }
        })

        const deleteButton = document.querySelector("#e-contextmenu-delete")
        deleteButton.addEventListener("click", () => {
            if (!this.contextMenuSelected || !this.contextMenuSelectedHtml) return

            sceneHandler.removeObjectRender(this.contextMenuSelected.object.id)

            project.removeObject(this.contextMenuSelected.object.id)
            this.removeElement(this.contextMenuSelected.id)
        })

        const renameButton = document.querySelector("#e-contextmenu-rename")
        renameButton.addEventListener("click", () => {
            if (!this.contextMenuSelected || !this.contextMenuSelectedHtml) return

            this.setElementInput(true)
        })

        const duplicateButton = document.querySelector("#e-contextmenu-duplicate")
        duplicateButton.addEventListener("click", () => {
            if (!this.contextMenuSelected || !this.contextMenuSelectedHtml) return

            let newObjectId = this.project.generateObjectId()
            let originalObject = this.contextMenuSelected.object
            let newObject = cloneObject(originalObject, newObjectId)
            let explorerObject = new ExplorerElement(newObject.name, newObjectId, this.contextMenuSelected.elementType, this.contextMenuSelected.parent, this.contextMenuSelected.scene, newObject)

            sceneHandler.updateObjectRender(newObject)

            this.addElement(explorerObject)
            this.project.objects.push(newObject)
        })
    }

    setElementInput(state){
        if (!this.contextMenuSelected || !this.contextMenuSelectedHtml) return

        this.contextMenuSelectedHtml.childNodes.forEach(child => {
            if (child instanceof HTMLInputElement){
                if (state){
                    child.readOnly = false
                    child.focus({"preventScroll": true})
                    child.setSelectionRange(child.value.length, child.value.length)
                }
                else{
                    this.project.changeObjectName(this.contextMenuSelected.id, child.value)
                    this.contextMenuSelected.name = child.value

                    this.contextMenuSelected = NaN
                    this.contextMenuSelectedHtml = NaN

                    this.objectData.onObjectSelected()
                    this.render()
                }
            }
        })
    }

    addElement(explorerElement){
        this.content.push(explorerElement)

        this.render()
    }

    removeElement(explorerElementId){
        let elementIndex = -1

        for (let i = 0; i < this.content.length; i++){
            const explorerElement = this.content[i]

            if (explorerElement.id !== explorerElementId) continue

            elementIndex = i

            break
        }

        if (elementIndex < 0) return

        this.content.splice(elementIndex, 1)

        this.render()
    }

    removeLastRender(){
        while (this.renderDiv.children.length > 0){
            this.renderDiv.firstChild.remove()
        }
    }

    foldChildElements(explorerElement, childElements, state){
        for (let i = 0; i < childElements.length; i++){
            const child = childElements[i]

            child.folded = state

            let children = this.getElementChildren(child)

            if (children.length > 0){
                this.foldChildElements(child, children, state)
            }
        }
    }

    createHtmlElement(explorerElement){
        const htmlElement = document.createElement("div")
        const elementType = document.createElement("img")
        const elementName = document.createElement("input")
        const fold = document.createElement("h3")

        htmlElement.append(elementType)
        htmlElement.append(elementName)
        htmlElement.append(fold)

        elementType.setAttribute("src", explorerElement.elementType)
        elementName.value = explorerElement.name
        elementName.readOnly = true
        elementName.style.cursor = "default"

        let children = this.getElementChildren(explorerElement)
        let foldClicked = false

        if (explorerElement.selected){
            htmlElement.style.backgroundColor = "rgb(150, 150, 150)"
            this.selectedElementHtml = htmlElement
            this.selectedElement = explorerElement
        }

        if (children.length <= 0){
            fold.remove()
        }
        else{
            let folded = false

            for (let i = 0; i < children.length; i++){
                const child = children[i]

                if (child.folded){
                    folded = true
                    break
                }
            }

            if (folded){
                fold.innerText = "→"
                fold.style.left = "-2.5rem"
            }
            else{
                fold.innerText = "↓"
            }
        }

        fold.addEventListener("click", () => {
            let state = true
            if (children[0].folded) state = false
            foldClicked = true

            this.foldChildElements(explorerElement, children, state)

            setTimeout(() => {
                this.render()
                foldClicked = false
            }, 100)
        })

        htmlElement.addEventListener("click", () => {
            if (foldClicked) return

            if (explorerElement.selected){
                explorerElement.selected = false
                htmlElement.style.backgroundColor = "transparent"
                this.selectedElement = NaN
                this.selectedElementHtml = NaN
            }
            else{
                explorerElement.selected = true
                htmlElement.style.backgroundColor = "rgb(150, 150, 150)"

                if (this.selectedElementHtml){
                    this.selectedElementHtml.style.backgroundColor = "transparent"
                    this.selectedElement.selected = false
                }
                this.selectedElementHtml = htmlElement
                this.selectedElement = explorerElement
            }

            if (this.objectData){
                this.objectData.onObjectSelected()
            }
        })

        htmlElement.addEventListener("contextmenu", (event) => {
            event.preventDefault()

            const mouseX = event.clientX
            const mouseY = event.clientY

            const contextMenu = document.querySelector("#explorer-contextmenu")

            contextMenu.style.left = `${mouseX}px`
            contextMenu.style.top = `${mouseY}px`

            contextMenu.style.display = "flex"

            this.setElementInput(false)

            this.contextMenuSelected = explorerElement
            this.contextMenuSelectedHtml = htmlElement
        })

        return htmlElement
    }

    getElementChildren(explorerElement){
        let elements = []

        for (let i = 0; i < this.content.length; i++){
            const element = this.content[i]

            if (element.parent === explorerElement.id){
                elements.push(element)
            }
        }

        return elements
    }

    renderElementChildren(explorerElement, sceneElements, parentHtmlElement){
        for (let i = 0; i < sceneElements.length; i++){
            const sceneElement = sceneElements[i]
            const parent = sceneElement.parent

            if (parent === explorerElement.id && !sceneElement.folded){
                const htmlElement = this.createHtmlElement(sceneElement)
                this.renderDiv.append(htmlElement)
                htmlElement.style.marginLeft = `calc(${parentHtmlElement.style.marginLeft} + 2.5rem)`

                this.renderElementChildren(sceneElement, sceneElements, htmlElement)
            }
        }
    }

    renderScene(sceneName, sceneElements){
        const sceneElement = new ExplorerElement(sceneName, -1, "assets/images/web/cinema.png", NaN, NaN)
        const sceneHtmlElement = this.createHtmlElement(sceneElement)

        this.renderDiv.append(sceneHtmlElement)
      
        for (let i = 0; i < sceneElements.length; i++) {
            const element = sceneElements[i]
            const parent = element.parent

            if (!parent && parent !== 0 && !element.folded) {
                const htmlElement = this.createHtmlElement(element)
                this.renderDiv.append(htmlElement)
                htmlElement.style.marginLeft = "3rem"

                this.renderElementChildren(element, sceneElements, htmlElement)
            }
        }
    }

    render(){
        this.removeLastRender()

        let scenes = []
        let sceneElements = []
        this.content.forEach(explorerElement => {
            if (!scenes.includes(explorerElement.scene)){
                scenes.push(explorerElement.scene)
            }

            let sceneIndex = scenes.indexOf(explorerElement.scene)

            while (sceneIndex > sceneElements.length -1){
                sceneElements.push([])
            }

            sceneElements[sceneIndex].push(explorerElement)
        })

        for (let i = 0; i < scenes.length; i++){
            this.renderScene(scenes[i], sceneElements[i])
        }
    }
}
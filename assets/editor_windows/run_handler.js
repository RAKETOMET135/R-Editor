import { cloneObject } from "../objects/object.js"

export class RunHandler{
    static runHandlerInstance = NaN

    constructor(sceneHandler, projectData){
        this.sceneHandler = sceneHandler
        this.projectData = projectData
        this.currentRunWindow = NaN
        this.objects = []
        this.dynamicObjects = []
        this.runState = false
        this.lastTime = 0
        this.paused = false
        this.cameraPositionAdjust = [0, 0, 0]

        RunHandler.runHandlerInstance = this
    }

    createRunWindow(){
        const runWindow = document.createElement("div")
        const sceneWindow = this.sceneHandler.scene
        const sceneWindowComputedStyle = window.getComputedStyle(sceneWindow)

        runWindow.style.width = sceneWindowComputedStyle.width
        runWindow.style.height = sceneWindowComputedStyle.height
        runWindow.style.position = "absolute"
        runWindow.style.left = sceneWindowComputedStyle.left
        runWindow.style.top = sceneWindowComputedStyle.top
        runWindow.style.zIndex = -1
        runWindow.style.border = "2px solid var(--sec-background-color)"
        runWindow.style.backgroundColor = "black"

        return runWindow
    }

    appendSceneObjects(runWindow){
        const objects = this.sceneHandler.objects

        for (let i = 0; i < objects.length; i++){
            const object = objects[i]
            
            const objectToClone = this.projectData.getObject(object[0])
            const clonnedObject = cloneObject(objectToClone, object[0])

            const htmlElementToClone = object[1]
            const clonnedHtmlElement = htmlElementToClone.cloneNode(true)
            runWindow.append(clonnedHtmlElement)

            let runObject = [clonnedObject, clonnedHtmlElement]

            this.objects.push(runObject)

            if (clonnedObject.containsData("Gravity")){
                this.dynamicObjects.push(runObject)
            }
        }
    }

    runLoop(deltaTime){
        for (let i = 0; i < this.dynamicObjects.length; i++){
            const dynamicObject = this.dynamicObjects[i]
            const gravityForce = dynamicObject[0].getDataValue("Gravity")[0]
            const transform = dynamicObject[0].getDataValue("Transform")
            const image = dynamicObject[0].getDataValue("Image")
            const htmlElement = dynamicObject[1]

            transform[0][1] = transform[0][1] - (gravityForce/2 * deltaTime)

            const calcHeight = image[0][1]
            let calcTop = 0 - calcHeight/2 - this.cameraPositionAdjust[1] - transform[0][1]

            htmlElement.style.top = `${calcTop}px`
        }
        
    }

    runScene(){
        if (this.runState || this.paused) return

        const runWindow = this.createRunWindow()
        const rEditorSection = document.querySelector("#r-editor")

        rEditorSection.append(runWindow)
        this.currentRunWindow = runWindow

        this.appendSceneObjects(runWindow)

        this.runState = true
        this.lastTime = 0

        window.requestAnimationFrame(runLoopHandler)
    }

    puaseScene(state){
        if (state){
            this.runState = false
        }
        else{
            this.runState = true
            this.lastTime = 0

            window.requestAnimationFrame(runLoopHandler)
        }

        this.paused = state
    }

    stopScene(){
        this.paused = false
        this.runState = false
        this.currentRunWindow.remove()
        this.objects = []
        this.dynamicObjects = []
        this.lastTime = 0
    }
}

function runLoopHandler(time){
    if (RunHandler.runHandlerInstance.lastTime === 0) RunHandler.runHandlerInstance.lastTime = time

    let deltaTime = (time - RunHandler.runHandlerInstance.lastTime) / 10
    if (deltaTime === 0) deltaTime = 1
    RunHandler.runHandlerInstance.lastTime = time

    RunHandler.runHandlerInstance.runLoop(deltaTime)

    if (RunHandler.runHandlerInstance.runState){
        window.requestAnimationFrame(runLoopHandler)
    }
}
import { StringConverter } from "../utils/string_converter.js"

export class SceneHandler{
    constructor(sceneElement){
        this.scene = sceneElement
        this.objects = []
        this.cameraPositionAdjust = [0, 0, 0]
    }

    getSceneObject(objectId){
        for (let i = 0; i < this.objects.length; i++){
            const objectElement = this.objects[i]
            const objectElementId = objectElement[0]

            if (objectElementId !== objectId) continue

            return objectElement
        }

        return NaN
    }

    getSceneObjectArrayPosition(objectId){
        for (let i = 0; i < this.objects.length; i++){
            const objectElement = this.objects[i]
            const objectElementId = objectElement[0]

            if (objectElementId !== objectId) continue

            return i
        }

        return -1
    }

    removeObjectRender(objectId){
        let objectElement = this.getSceneObject(objectId)
        
        if (!objectElement) return

        let index = this.getSceneObjectArrayPosition(objectId)

        if (index >= 0){
            this.objects.splice(index, 1)
        }
        
        objectElement[1].remove()
    }

    updateObjectRender(object){
        let objectElement = this.getSceneObject(object.id)

        if (object.containsData("Image") && object.containsData("Transform")){
            const transform = object.getDataValue("Transform")
            const image = object.getDataValue("Image")

            if (!objectElement){
                const htmlElement = document.createElement("img")
                htmlElement.style.position = "absolute"
                this.scene.append(htmlElement)

                objectElement = [object.id, htmlElement]

                this.objects.push(objectElement)
            }

            const htmlElement = objectElement[1]
            htmlElement.setAttribute("src", image[1])

            const calcWidth = image[0][0]
            const calcHeight = image[0][1]

            htmlElement.style.width = `${calcWidth}px`
            htmlElement.style.height = `${calcHeight}px`

            let calcLeft = 0 - calcWidth/2 + this.cameraPositionAdjust[0] + transform[0][0]
            let calcTop = 0 - calcHeight/2 - this.cameraPositionAdjust[1] - transform[0][1]

            htmlElement.style.left = `${calcLeft}px`
            htmlElement.style.top = `${calcTop}px`

            let otherTranform = `rotateX(${transform[1][0]}deg) rotateY(${transform[1][1]}deg) rotateZ(${transform[1][2]}deg) translateZ(${transform[3][2]}px) translateX(${transform[3][0]}px) translateY(${-transform[3][1]}px) scaleX(${transform[2][0]}) scaleY(${transform[2][1]}) scaleZ(${transform[2][2]})`

            htmlElement.style.transform = otherTranform
            htmlElement.style.opacity = `${1 - image[2]}`
            htmlElement.style.imageRendering = image[3]
        }
        else{
            this.removeObjectRender(object.id)
        }
    }
}
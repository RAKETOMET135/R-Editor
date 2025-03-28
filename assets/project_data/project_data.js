export class ProjectData{
    constructor(projectName){
        this.projectName = projectName
        this.objects = []
    }

    generateObjectId(){
        let maxId = 0

        for (let i = 0; i < this.objects.length; i++){
            const object = this.objects[i]

            if (object.id < maxId) continue

            maxId = object.id
        }

        return maxId + 1
    }

    changeObjectName(objectId, newObjectName){
        for (let i = 0; i < this.objects.length; i++){
            const object = this.objects[i]

            if (object.id !== objectId) continue

            object.name = newObjectName

            break
        }
    }

    getObject(objectId){
        for (let i = 0; i < this.objects.length; i++){
            const object = this.objects[i]

            if (object.id !== objectId) continue

            return object
        }
    }

    removeObject(objectId){
        let objectIndex = -1

        for (let i = 0; i < this.objects.length; i++){
            const object = this.objects[i]

            if (object.id !== objectId) continue

            objectIndex = i

            break
        }

        if (objectIndex < 0) return

        this.objects.splice(objectIndex, 1)
    }
}
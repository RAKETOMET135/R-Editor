export class Object{
    constructor(name, id){
        this.name = name
        this.id = id
        this.tag = ""
        this.data = []
    }

    containsData(dataName){
        for (let i = 0; i < this.data.length; i++){
            const curData = this.data[i]

            if (curData[0] !== dataName) continue

            return true
        }

        return false
    }

    getDataValue(dataName){
        for (let i = 0; i < this.data.length; i++){
            const curData = this.data[i]

            if (curData[0] !== dataName) continue

            return curData[1]
        }

        return NaN
    }

    addData(data){
        let dataExists = false

        for (let i = 0; i < this.data.length; i++){
            const curData = this.data[i]

            if (curData[0] !== data[0]) continue

            dataExists = true

            break
        }

        if (dataExists) return

        this.data.push(data)
    }
}

export function cloneObject(object, newObjectId){
    const clone = new Object(object.name + "_clone", newObjectId)

    clone.tag = object.tag
    
    for (let i = 0; i < object.data.length; i++){
        const data = object.data[i]

        let newData = [data[0]]
        let newDataContent = []

        for (let j = 0; j < data[1].length; j++){
            let newDataDataContent = []

            if (Array.isArray(data[1][j])){
                for (let k = 0; k < data[1][j].length; k++){
                    newDataDataContent.push(data[1][j][k])
                }
            }
            else{
                newDataDataContent = data[1][j]
            }

            newDataContent.push(newDataDataContent)  
        }
        newData.push(newDataContent)

        clone.data.push(newData)
    }

    return clone
}
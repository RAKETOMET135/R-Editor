export class Object{
    constructor(name, id){
        this.name = name
        this.id = id
        this.tag = ""
        this.data = []
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

    cloneObject(){
        const clone = new Object(this.name, this.id)

        clone.tag = this.tag
        clone.data = this.data

        return clone
    }
}
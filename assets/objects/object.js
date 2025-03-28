export class Object{
    constructor(name, id){
        this.name = name
        this.id = id
        this.tag = ""
        this.data = []
    }

    cloneObject() {
        const clone = new Object(this.name, this.id)

        clone.tag = this.tag
        clone.data = this.data

        return clone
    }
}
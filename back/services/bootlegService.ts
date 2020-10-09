import IBootleg from "../types/interfaces/IBootleg.ts"

export default class BootlegService {
    private bootlegs: Array<IBootleg>

    constructor() {
        this.bootlegs = [{
            id: 1,
            title: "Robin Wieruch1",
            description: "The Road to React",
        }, {
            id: 2,
            title: "Robin Wieruch2",
            description: "The Road to React",
        }, {
            id: 3,
            title: "Robin Wieruch3",
            description: "The Road to React",
        }]
    }

    findById(id: number) {
        return this.bootlegs.find((x: IBootleg) => x.id === id)
    }

    getAll() {
        return this.bootlegs
    }

    add(bootleg: IBootleg) {
        this.bootlegs.push(bootleg)
    }
    updateById(id: number, bootleg: any) {
        let boot = this.bootlegs.find((x: IBootleg) => x.id === id)
        boot = { ...boot, ...bootleg }
        this.bootlegs = [...this.bootlegs.filter(bootleg => bootleg.id !== id), bootleg]
        return bootleg
    }

    removeById(id: number) {
        this.bootlegs = this.bootlegs.filter(bootleg => bootleg.id !== id)
    }
}
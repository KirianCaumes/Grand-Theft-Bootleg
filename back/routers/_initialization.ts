import BandController from "../controllers/band.controller.ts"
import BootlegController from "../controllers/bootleg.controller.ts"
import DefaultController from "../controllers/default.controller.ts"
import SongController from "../controllers/song.controller.ts"
import { BootlegsCollection } from "../models/bootleg.model.ts"
import { bootlegValidator } from "../validators/bootleg.validator.ts"

//Collection
const bootlegsCollection = new BootlegsCollection()

//Controllers
const bootlegController = new BootlegController(bootlegsCollection, bootlegValidator)
const bandController = new BandController(bootlegsCollection)
const songController = new SongController(bootlegsCollection)
const defaultController = new DefaultController()

export {
    bootlegController,
    bandController,
    songController,
    defaultController
}
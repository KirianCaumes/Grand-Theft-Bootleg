import BootlegController from "../controllers/bootleg.controller.ts"
import DefaultController from "../controllers/default.controller.ts"
import { BootlegsCollection } from "../models/bootleg.model.ts"
import { bootlegValidator } from "../validators/bootleg.validator.ts"

//Collection
const bootlegsCollection = new BootlegsCollection()

//Controllers
const bootlegController = new BootlegController(bootlegsCollection, bootlegValidator)
const defaultController = new DefaultController()

export {
    bootlegController,
    defaultController
}
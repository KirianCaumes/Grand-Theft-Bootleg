import BootlegController from "../controllers/bootleg.controller.ts"
import DefaultController from "../controllers/default.controller.ts"
import { bootlegsCollection } from "../schemas/bootleg.model.ts"
import { bootlegValidator } from "../validators/bootleg.validator.ts"

//Controllers
const bootlegController = new BootlegController(bootlegsCollection, bootlegValidator)
const defaultController = new DefaultController()

export {
    bootlegController,
    defaultController
}